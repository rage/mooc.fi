import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import styled from "@emotion/styled"
import { getAccessToken } from "../../../lib/authentication"

const BASE_URL = "https://mooc.fi"

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

  const showClient = async () => {
    axios({
      method: "GET",
      url: `${BASE_URL}/auth/client/${router.query.id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken(undefined)}`,
      },
    })
      .then((response) => response.data)
      .then((json) => setClient(json))
      .catch((json) => console.log(json))
  }

  const updateClient = async () => {
    axios({
      method: "PUT",
      url: `${BASE_URL}/auth/client/${router.query.id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken(undefined)}`,
      },
    })
      .then((response) => response.data)
      .then((json) => setClient(json))
      .catch((json) => console.log(json))
  }

  const regenerateClient = async () => {
    axios({
      method: "POST",
      url: `${BASE_URL}/auth/regenerateSecret/${router.query.id}`,
      data: {},
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken(undefined)}`,
      },
    })
      .then((response) => response.data)
      .then((json) => setClient(json.client))
      .catch((json) => console.log(json))
  }

  const deleteClient = async () => {
    axios({
      method: "POST",
      url: `${BASE_URL}/auth/deleteClient/${router.query.id}`,
      data: {},
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken(undefined)}`,
      },
    })
      .then((response) => response.data)
      .then(() => {
        router.push("/en/auth/clients")
      })
      .catch((json) => console.log(json))
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
          <CancelButton onClick={updateClient}>Save</CancelButton>
        </section>
      </Options>
    </Container>
  )
}

export default ClientDetails
