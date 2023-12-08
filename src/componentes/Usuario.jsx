import React, {useState, useEffect} from 'react'

const Usuario = (props) => {

    const [usuario, setUsuario] = useState('')

    useEffect(() => {
        fetchUsuario()

    }, [])

    const fetchUsuario = async() => {
        try {
            const res = await props.referencia.get()
            setUsuario(res.data().nombre)
        } catch (error) {
            console.log(error)
        }
    }
    

    return (
        <>
            <span> {usuario}</span>
        </>
    )
}

export default Usuario