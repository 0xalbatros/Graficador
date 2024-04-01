import { useEffect, useState } from "react"
import Grafica from "./Graficar"



export const CompGrafica = () => {
    const signos = [{simbolo:"*", nombre:"multiplicar" }, {simbolo:"**", nombre:"exp"}, {simbolo:"+", nombre:"suma"}, {simbolo:"-", nombre:"resta"}, {simbolo:"/", nombre:"division"}, {simbolo:".", nombre:"punto"}, {simbolo:"x", nombre:"varX"}, {simbolo:"(", nombre:"pizd"}, {simbolo:")", nombre:"pder"}]
    const numeros = [{cero: 0}, {uno: 1}, {dos: 2}, {tres: 3}, {cuatro: 4}, {cinco: 5}, {seis: 6}, {siete: 7}, {ocho: 8}, {nueve: 9}]
    const mathFuncs = Object.getOwnPropertyNames(Math).filter(func => typeof Math[func] === "function")
    const mathNum = Object.getOwnPropertyNames(Math).filter(func => typeof Math[func] === "number")
    let [fx, setFx] = useState({input:"", math:""})
    let [error, setError] = useState([])
    let [init, setInit]= useState(false)
    let [trazos, setTrazos]= useState(JSON.parse(localStorage.getItem("trazos")))
    let [op, setOp] = useState([])
    let grafica
    
    useEffect(()=>{
        localStorage.setItem("trazos", JSON.stringify(trazos))
    }, [trazos])
    

    const plano = async () => {
        if (!init){
            setTimeout(() => {
                try {
                    grafica = new Grafica("grafica", 50)
                    grafica.createRect(0,0,grafica.width, grafica.height,"white")
                    grafica.planoCartesiano()
                    trazos ? trazos.forEach(t => grafica.trazar(t.trazoMath,10,0.05,t.color)) : setTrazos([])
                    setInit(true)
                } catch (error) {
                    trazos ? setTrazos(
                        trazos.slice(0,-1)
                    ) : null
                    setError(["Error: "+error.message])
                    return
                }
            }, 0);
        } else {
            return
        }
    }

    (async () => {
        await plano()
    })();
    
    const trazar = () => {
        try {
            validar()
            if(trazos.some(t => t.trazoMath === fx.math)){
                throw new Error("Grafico repetido")
            }else{
                setTrazos([...trazos, {trazoMath: fx.math, trazoInput: fx.input, color: `rgb(25,${Math.ceil((Math.random()*0.2) * 255)},${Math.ceil((Math.random()*0.2) * 255)} )`}])
                setInit(false)
            }
        } catch (error) {
            setError(["Error: "+error.message])
        }
        return  
    }

    const handleValue = (input, math) => {
        setError([])
        setFx({
            input: fx.input + input,
            math: fx.math + math
            })
            console.log(fx)
        return
    }

    const borrar = () => {
        if (fx.input.length == 1){
            reset()
        } else{
            setFx({
                input: fx.input.slice(0, -1),
                math: fx.math.slice(0, -1)
            })
        }
        console.log(fx)
        return
    }

    const reset = () => {
        setFx({
            input:"",
            math:""
        })
        return
    }


    const igual = () => {
        try {
            validar()
            console.log(fx.math)
            let resultado = eval(fx.math)
            setOp([
                ...op,
                {operacion: fx.input,
                result: resultado}
            ])
            return 
        } catch (error) {
            setError(["Error: "+error.message])
            return
        }
    }

    const parentesis = () => {
        try {
            setFx({
                input:"("+fx.input+")",
                math:"("+fx.math+")"
            })
            console.log(fx)
            return  
        } catch (error) {
            setError(["Error al agregar parentesis"])
            return
        }
    }

    const eliminarTrazo = (trazo) => {
        try {
            let tr = trazos.filter(t=> t.trazoInput !== trazo)
            setTrazos(tr)
            setInit(false)
            return
        } catch (error) {
            setError(["Error: "+error.message])
        }
    }

    const validar = () => {
        fx.math.replace(/(\d+|x+)(x)/g, "$1*$2") ? fx.math = fx.math.replace(/(\d+|x)(x)/g, "$1*$2") : fx.math
        fx.math.replace(/(Math\.+)(x|\d)/g, "$2") ? fx.math = fx.math.replace(/(Math\.+)(x|\d)/g, "$2") : fx.math
        fx.math.replace(/(\)+)(Math|[0-9]|[a-z]|[A-Z]|\()/g, "$1*$2") ? fx.math = fx.math.replace(/(\)+)(Math|[0-9]|[a-z]|[A-Z]|\()/g, "$1*$2") : fx.math
        fx.math.replace(/([0-9]+|[xIE]+)(\()/g, "$1*$2") ? fx.math = fx.math.replace(/([0-9]+|[xIE]+)(\()/g, "$1*$2") : fx.math
        fx.math.replace(/([IE]+|LN10+|LN2+|1_2+|T2+)(Math|x)/, "$1*$2") ? fx.math = fx.math.replace(/([IE]+|LN10+|LN2+|1_2+|T2+)(Math|x)/, "$1*$2") : fx.math
        return
    }

    const closeError = () => {
        setError([])
    }



    return (
        <div className="contenedor-grafica">
            <h1>Graficar Funciones</h1>
            <div className="graficador">
                {error ? error.map(er => (
                    <div key={Math.random() *1000} style={{position: "absolute", margin:"10", zIndex:"100", top:"30%", background: "gray", borderRadius: "5px", width: "200", border: "0.5px solid black", textAlign: "center"}}>
                        <p style={{color: "white"}}>
                            {er}
                        </p>
                        <button className="code-button" onClick={closeError}>close</button>
                    </div>
                )) : null}
                <div className="calculadora">
                    <input style={{gridArea: "input"}} className="input" type="text" value={Object.values(fx.input).join("")} disabled />
                    {mathFuncs.map(operacion => (
                        <button key={Math.random()*1000} style={{gridArea: operacion}} className={operacion + " math"} onClick={() => handleValue(operacion+"(", "Math."+operacion+"(")}>{operacion+"()"}</button>
                        ))}
                    {mathNum.map(operacion => (
                        <button key={Math.random()*1000} style={{gridArea: operacion}} className={operacion + " math"} onClick={() => handleValue(operacion, "Math."+operacion)}>{operacion}</button>
                        ))}
                    {numeros.map(num => (
                        <button key={Math.random()*1000} style={{gridArea: Object.keys(num)}} className={Object.keys(num)+ " numeros"} onClick={() => handleValue(Object.values(num).join(""), Object.values(num).join(""))}>{Object.values(num)}</button>
                        ))}
                    {signos.map(sg => (
                        <button key={Math.random()*1000} style={{gridArea: sg.nombre}} className={sg.nombre + " signos"} onClick={() => handleValue(Object.values(sg.simbolo).join(""), Object.values(sg.simbolo).join(""))}>{sg.simbolo}</button>
                        ))}
                    <button className="borrar" style={{gridArea: "borrar"}} onClick={borrar}>{"<"}</button>
                    <button className="reset" style={{gridArea: "reset"}} onClick={reset}>Reset</button>
                    <button className="eval" style={{gridArea: "eval"}} onClick={trazar}>Graficar</button>
                    <button className="igual" style={{gridArea: "igual"}} onClick={igual}>=</button>
                    <button className="parentesis" style={{gridArea: "prtss"}} onClick={parentesis}>{"(encerrar)"}</button>
                    <div style={{margin: 20, display: (op.length > 0 ? "block" : "none"), width: "100%"}}>
                        <h3>Resultados</h3>
                        <ul>
                            {op.map(o => (
                                <li key={Math.random()*1000} style={{color: "white"}}>
                                    {o.operacion + " = " + o.result}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="canva">
                    <canvas id={"grafica"} className="plano" width={"1000"} height={"1000"}></canvas>
                </div>
                <div className="lista-graficas" style={{width: "300"}}>
                    <div style={{margin:"20", fontSize: "28", width:"300"}}>
                        <h4>Graficas</h4>
                        <ul >
                            {trazos ? trazos.map(t => (
                                    <li style={{
                                    display: "flex",
                                    background:t.color, 
                                    margin: "10px", 
                                    color:"white",        
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                    marginRight: '10px',
                                    justifyContent: "space-between",
                                    }} key={Math.random()*1000}>
                                        <p style={{marginLeft: 50}}>
                                            {t.trazoInput}
                                        </p>
                                        <button className="code-button" onClick={()=>eliminarTrazo(t.trazoInput)}>borrar</button>
                                    </li>  
                            )): null}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
