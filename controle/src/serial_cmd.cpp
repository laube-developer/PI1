#include "serial_cmd.h"
#include <ArduinoJson.h>
#include "command_queue.h"

static String line;

static CmdType parseType(const String& s){
  if(s=="FORWARD") return CmdType::FORWARD;
  if(s=="TURN")    return CmdType::TURN;
  if(s=="STOP")    return CmdType::STOP;
  return CmdType::NONE;
}

static bool parseJsonToCommand(const String& jsonLine, Command& out){
  StaticJsonDocument<256> doc;
  auto err = deserializeJson(doc, jsonLine);
  if(err) return false;

  String type = doc["type"] | "";
  float  val  = doc["value"] | 0.0f;

  CmdType t = parseType(type);
  if(t==CmdType::NONE) return false;

  out.type = t;
  out.value = val;
  return true;
}

bool serial_poll_and_enqueue(){
  bool enq=false;

  while(Serial.available()>0){
    char ch=(char)Serial.read();
    if(ch=='\r') continue;

    if(ch=='\n'){
      String s=line; line="";
      s.trim();
      if(s.length()==0) continue;

      if(s.equalsIgnoreCase("HELP")){
        Serial.println("Exemplos:");
        Serial.println(R"({"type":"FORWARD","value":100})");
        Serial.println(R"({"type":"TURN","value":90})");
        Serial.println(R"({"type":"TURN","value":-90})");
        Serial.println(R"({"type":"STOP"})");
        continue;
      }

      Command c;
      if(!parseJsonToCommand(s,c)){
        Serial.println("[SERIAL] JSON invalido. Digite HELP.");
        continue;
      }
      if(!cmdq::push(c)){
        Serial.println("[SERIAL] fila cheia (16).");
        continue;
      }
      Serial.printf("[SERIAL] enfilei: %s %.2f (fila=%u)\n",
        c.type==CmdType::FORWARD?"FORWARD":c.type==CmdType::TURN?"TURN":"STOP",
        c.value,(unsigned)cmdq::size());
      enq=true;
    }else{
      line+=ch;
      if(line.length()>240){ Serial.println("[SERIAL] linha muito longa."); line=""; }
    }
  }
  return enq;
}
