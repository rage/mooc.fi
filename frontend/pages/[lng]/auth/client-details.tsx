import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styled from '@emotion/styled'
import Cookies from 'universal-cookie'

const Container = styled.section`
    width:100%;
    max-width:1024px;
    margin:0 auto;
    padding:10px;
    box-sizing:border-box;
`

const Table = styled.table`
    width:100%;
    
    th, td {
        text-align:left;
        padding:8px;
    }

    tr:nth-of-type(even) {
        background-color: #EEEEEE;
    }
`

const ClientOptions = styled.section`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:flex-start;
    margin-bottom:16px;
    padding-bottom:16px;
    border-bottom:1px solid #DDDDDD;
`

const ClientButton = styled.div`
    padding:8px 16px;
    background: #ffc107;
    font-weight: bold;
    font-size:18px;
    border-radius:5px;
    user-select:none;
    cursor:pointer;

    &:hover {
        opacity:0.7;
    }
`

const CancelButton = styled.div`
    padding:8px 16px;
    background: #CCCCCC;
    font-weight: bold;
    font-size:18px;
    border-radius:5px;
    user-select:none;
    cursor:pointer;

    &:hover {
        opacity:0.7;
    }
`

const DeleteButton = styled.div`
    padding:8px 16px;
    background:rgba(255, 0, 51, 0.5);
    font-weight: bold;
    font-size:18px;
    border-radius:5px;
    user-select:none;
    cursor:pointer;

    &:hover {
        opacity:0.7;
    }
`

const InputOptions = styled.div`
    display:flex;
    margin-top:10px;

    div {
        margin-right:8px;
    }
`

const InputContainer = styled.div`
    display:flex;
    align-items:center;
    margin:10px 0px;

    label {
        font-weight:bold;
        margin-right:8px;
    }

    input {
        padding:8px;
        border-radius:5px;
        outline:none;
        border:1px solid #AAAAAA;
    }
`

const CreateComplete = styled.div`
    padding:8px;
    color: #146600;
    background:rgba(51, 255, 0, 0.1);
    border:1px solid #33FF00;
    border-radius:5px;
    margin-bottom:16px;
    overflow:auto;

    p {
        margin:0;
        margin-bottom:5px;
        display:flex;

        strong {
            margin-right:5px;
        }
    }
`

const CreateError = styled.div`
    padding:8px;
`

const Main = styled.main`
    padding:16px;
    box-sizing: border-box;
    color: #146600;
    border-radius:5px;
    margin-bottom:16px;
    overflow:auto;
    background:#FFFFFF;

    p {
        margin:0;
        margin-bottom:5px;
        display:flex;

        strong {
            margin-right:5px;
        }
    }
`

const Options = styled.section`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    margin-top:16px;
    background: #FFFFFF;
    box-sizing:border-box;
    padding:8px;
    border-radius:5px;

    div {
        margin-left:10px;
    }

    section {
        display: flex;
    }
`

const ConfirmOptions = styled.div`
    display:flex;
    align-items: center;
`


const ClientDetails = () => {
    const cookies = new Cookies()
    const router = useRouter()
    //const token = cookies.get("token")
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTU5MTI5MTQsIm1heEFnZSI6MzE1MzYwMDAwMDAsImlkIjoiZTgwZWRkOTctZDg4MC00MWE4LWE5ZGYtNjIwODk3YTdiZjUxIiwiYWRtaW4iOmZhbHNlLCJub25jZSI6IjlkNjFlOTQ4NjcxZTU5ZWJjNjQzZjY3ZmU4MDFlZDgyIiwiand0aWQiOiI1OTUxODFmMWM4NzdjOGZjZmQ0M2YyODkyNzcwNDdkNjBhMzc5MmQwMzExNDA5MTkxM2EzOTYxNTA3MDc0YzY2OGJjYjBlNjAwNDZlZDE2MTlkZGM1NTFlY2FiMzM5YzZmZGZhYjI3ZjIwYTczYzM4OTA0OTA3ZmY2NDgyZWJmMyIsImlhdCI6MTYxNTkwOTMxNCwiYXVkIjoiVGVzdCBOYW1lIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL2F1dGgvdG9rZW4iLCJzdWIiOiJibk52YUdGeVlXSXJNekF5UUdkdFlXbHNMbU52YlE9PSJ9.crU1-Zl4cculRrWRds7UQNYWcCuAoIHxPNBppzhb75M_JHiszYagqcbcIvkq3J19pAyBJ-T3jWwaF4rq4UewPqUqqYT82k0MPXfpY1eaXUzbUR8u1KJxZvbKcGV0L3D-5VFyfLDLeJuxi3hA0Ie3maKZbb0zd2H1eIVuDpzuvuuDivOV_RHayVaGVJaIlh111m6-QC1XyMmLlwdCp6UsH5nSOIAxVdhf4bhX7Ur2tm3-d8bCq4nUbt1nNQPPTT1kFh5U8Mx8S_DLZ5KF7T4vqx1cBjo7DTZsHRV0JBRRoFv5mRnw6gEndXDBm_mtX-doAgzLYQag3iPSISG2kytydQ"

    const [client, setClient] = useState<any>({})
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [confirmRegenerate, setConfirmRegenerate] = useState(false)

    useEffect(() => {
        showClient()
    }, [])

    const answerDelete = () => {
        setConfirmDelete(false)
        deleteClient()
    }

    const answerRegenerate = () => {
        setConfirmRegenerate(false)
        regenerateClient()
    }

    const showClient = () => {
        axios({
            method: 'GET',
            url: `http://localhost:4000/auth/client?id=${router.query.id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.data)
            .then(json => setClient(json))
            .catch(json => console.log(json))
    }

    const updateClient = () => {
        axios({
            method: 'PUT',
            url: `http://localhost:4000/auth/client?id=${router.query.id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.data)
            .then(json => setClient(json))
            .catch(json => console.log(json))
    }

    const regenerateClient = () => {
        axios({
            method: 'POST',
            url: `http://localhost:4000/auth/regenerateSecret?id=${router.query.id}`,
            data: {},
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.data)
            .then(json => setClient(json.client))
            .catch(json => console.log(json))
    }

    const deleteClient = () => {
        axios({
            method: 'POST',
            url: `http://localhost:4000/auth/deleteClient?id=${router.query.id}`,
            data: {},
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.data)
            .then(json => {
                router.push("/en/auth/clients")
            })
            .catch(json => console.log(json))
    }

    return (
        <Container>
            <h1>Client Detail</h1>
            <Main>
                <p><strong>client_id: </strong><span>{client.client_id}</span></p>
                <p><strong>client_secret: </strong><span>{client.client_secret}</span></p>
                <p><strong>name: </strong><span>{client.name}</span></p>
                <p><strong>redirect_uri: </strong><span>{client.redirect_uri}</span></p>
            </Main>
            <Options>
                <section>
                    {confirmDelete ?
                        <ConfirmOptions>
                            Are you sure?
                            <DeleteButton onClick={answerDelete}>Yes</DeleteButton>
                            <CancelButton onClick={() => setConfirmDelete(false)}>No</CancelButton>
                        </ConfirmOptions>
                        :
                        <DeleteButton onClick={() => setConfirmDelete(true)}>Delete</DeleteButton>
                    }
                </section>
                <section>
                    <ClientButton onClick={() => setConfirmRegenerate(true)}>Regenerate</ClientButton>
                    <CancelButton onClick={updateClient}>Save</CancelButton>
                </section>
            </Options>
        </Container>
    )
}

export default ClientDetails