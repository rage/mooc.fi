import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import {
  showClient,
  updateClient,
  regenerateClient,
  deleteClient,
} from "../../../services/moocfi"

const Container = styled.section`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
`

const ClientButton = styled.div`
  padding: 8px 16px;
  background: #ffc107;
  font-weight: bold;
  font-size: 18px;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`

const CancelButton = styled.div`
  padding: 8px 16px;
  background: #cccccc;
  font-weight: bold;
  font-size: 18px;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`

const DeleteButton = styled.div`
  padding: 8px 16px;
  background: rgba(255, 0, 51, 0.5);
  font-weight: bold;
  font-size: 18px;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`

const Main = styled.main`
  padding: 16px;
  box-sizing: border-box;
  color: #146600;
  border-radius: 5px;
  margin-bottom: 16px;
  overflow: auto;
  background: #ffffff;

  p {
    margin: 0;
    margin-bottom: 5px;
    display: flex;

    strong {
      margin-right: 5px;
    }
  }
`

const Options = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
  background: #ffffff;
  box-sizing: border-box;
  padding: 8px;
  border-radius: 5px;

  div {
    margin-left: 10px;
  }

  section {
    display: flex;
  }
`

const ConfirmOptions = styled.div`
  display: flex;
  align-items: center;
`

const ClientDetails = () => {
  const router = useRouter()

  const [client, setClient] = useState<any>({})
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmRegenerate, setConfirmRegenerate] = useState(false)

  useEffect(() => {
    fetchClient()
  }, [])

  const answerDelete = () => {
    setConfirmDelete(false)
    removeClient()
  }

  const answerRegenerate = () => {
    setConfirmRegenerate(false)
    regenerateClientKeys()
  }

  const fetchClient = async () => {
    try {
      const res = await showClient(router.query.id)
      setClient(res)
    } catch (error) {
      console.log(error)
    }
  }

  const putClient = async () => {
    try {
      const res = await updateClient(router.query.id)
      setClient(res)
    } catch (error) {
      console.log(error)
    }
  }

  const regenerateClientKeys = async () => {
    try {
      const res = await regenerateClient(router.query.id)
      setClient(res.client)
    } catch (error) {
      console.log(error)
    }
  }

  const removeClient = async () => {
    try {
      await deleteClient(router.query.id)
      router.push("/en/auth/clients")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <h1>Client Detail</h1>
      <Main>
        <p>
          <strong>client_id: </strong>
          <span>{client.client_id}</span>
        </p>
        <p>
          <strong>client_secret: </strong>
          <span>{client.client_secret}</span>
        </p>
        <p>
          <strong>name: </strong>
          <span>{client.name}</span>
        </p>
        <p>
          <strong>redirect_uri: </strong>
          <span>{client.redirect_uri}</span>
        </p>
      </Main>
      <Options>
        <section>
          {confirmDelete ? (
            <ConfirmOptions>
              Are you sure?
              <DeleteButton onClick={answerDelete}>Yes</DeleteButton>
              <CancelButton onClick={() => setConfirmDelete(false)}>
                No
              </CancelButton>
            </ConfirmOptions>
          ) : (
            <DeleteButton onClick={() => setConfirmDelete(true)}>
              Delete
            </DeleteButton>
          )}
        </section>
        <section>
          {confirmRegenerate ? (
            <ConfirmOptions>
              Are you sure?
              <ClientButton onClick={answerRegenerate}>Yes</ClientButton>
              <CancelButton onClick={() => setConfirmRegenerate(false)}>
                No
              </CancelButton>
            </ConfirmOptions>
          ) : (
            <ClientButton onClick={() => setConfirmRegenerate(true)}>
              Regenerate
            </ClientButton>
          )}
          <CancelButton onClick={putClient}>Save</CancelButton>
        </section>
      </Options>
    </Container>
  )
}

export default ClientDetails
