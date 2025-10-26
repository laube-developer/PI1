#include "net_mqtt.h"
#include "config.h"
#include "command_queue.h"
#include "commands.h"

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

static WiFiClient s_wifi;
static PubSubClient s_mqtt(s_wifi);
static unsigned long lastConnTryMs = 0;

// ---- helpers ----
static CmdType parseType(const String& s){
  if (s=="FORWARD") return CmdType::FORWARD;
  if (s=="TURN")    return CmdType::TURN;
  if (s=="STOP")    return CmdType::STOP;
  return CmdType::NONE;
}

static bool jsonToCommand(const char* buf, size_t len, Command& out){
  StaticJsonDocument<256> doc;
  auto err = deserializeJson(doc, buf, len);
  if (err) return false;

  String type = doc["type"] | "";
  float  val  = doc["value"] | 0.0f;

  CmdType t = parseType(type);
  if (t==CmdType::NONE) return false;

  out.type = t;
  out.value = val;
  return true;
}

// ---- MQTT callback ----
static void onMqtt(char* topic, byte* payload, unsigned int len){
  Serial.printf("[MQTT] msg @%s: ", topic);
  Serial.write(payload, len);
  Serial.println();

  Command c;
  if (!jsonToCommand((const char*)payload, len, c)) {
    Serial.println("[MQTT] JSON inválido (espera {type,value}).");
    return;
  }
  if (!cmdq::push(c)){
    Serial.println("[MQTT] fila cheia; descartando.");
    return;
  }
  Serial.printf("[MQTT] enfilei: %s %.2f (fila=%u)\n",
    c.type==CmdType::FORWARD?"FORWARD":c.type==CmdType::TURN?"TURN":"STOP",
    c.value, (unsigned)cmdq::size());
}

static void ensureWifi(){
  if (WiFi.status()==WL_CONNECTED) return;
  Serial.printf("[NET] WiFi conectando a \"%s\"...", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  unsigned long t0 = millis();
  while (WiFi.status()!=WL_CONNECTED && millis()-t0<8000) { delay(200); Serial.print("."); }
  if (WiFi.status()==WL_CONNECTED) {
    Serial.printf(" OK (%s)\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println(" FAIL");
  }
}

static void ensureMqtt(){
  if (s_mqtt.connected()) return;

  // evite tentar reconectar em loop apertado
  if (millis() - lastConnTryMs < 1500) return;
  lastConnTryMs = millis();

  s_mqtt.setServer(MQTT_HOST, MQTT_PORT);
  String cid = String("carro-esp32-") + String((uint32_t)ESP.getEfuseMac(), HEX);
  Serial.printf("[MQTT] conectando em %s:%d ... ", MQTT_HOST, MQTT_PORT);
  if (s_mqtt.connect(cid.c_str())) {
    Serial.println("OK");
    s_mqtt.subscribe(MQTT_SUB_TOPIC);
    Serial.printf("[MQTT] subscribed: %s\n", MQTT_SUB_TOPIC);
  } else {
    Serial.printf("FAIL rc=%d\n", s_mqtt.state());
  }
}

namespace netmqtt {

  void setup(){
    Serial.println("[NET] init WiFi+MQTT");
    s_mqtt.setCallback(onMqtt);
    ensureWifi();
    ensureMqtt();
  }

  void tick(){
    ensureWifi();
    ensureMqtt();
    s_mqtt.loop(); // processa mensagens pendentes
  }

} 
