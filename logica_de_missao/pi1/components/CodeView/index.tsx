'use client'

import {codeToHtml} from 'shiki'
import { useState, useEffect } from 'react';
import Button from '../Button';
import { IoIosArrowDown, IoIosArrowUp, IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io';

type CodeViewProps = {
    code: string
}

export default function CodeView({code}: CodeViewProps){
    const [html, setHtml] = useState('');
    const [isShow, setShow] = useState<boolean>(true);

    useEffect(() => {
        async function highlightCode() {
            if (!code || code === '[]') {
                setHtml('');
                return;
            }

            try {
                const result = await codeToHtml(code, {
                    lang: "json",
                    theme: "dracula"
                });
                setHtml(result);
            } catch (error) {
                console.error("Erro ao formatar código com Shiki:", error);
                setHtml(`<pre style="color: red;">Erro ao formatar JSON.</pre>`);
            }
        }

        highlightCode();
    }, [code]);

    return (
        <div 
            className={`"w-full p-2 rounded-lg shadow-inner text-sm flex flex-col gap-2 ${!isShow ? "h-max" : ""}`}
            style={{ backgroundColor: '#282A36' }}
        >
            <Button
                icon={isShow ? IoIosArrowDown : IoIosArrowUp}
                iconSize={20}
                className={"bg-transparent"}
                handleClick={() => setShow(!isShow)}
                children={!isShow ? "Ver JSON comandos" : "Fechar" }
            />
            {isShow && <div dangerouslySetInnerHTML={{__html: html}}></div>}
            
        </div>
    );
}
