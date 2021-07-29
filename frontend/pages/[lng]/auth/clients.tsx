import React, { useState, useEffect } from "react"
import LangLink from "/components/LangLink"
import styled from "@emotion/styled"
import { getClients, createClient } from "../../../services/moocfi"

const Container = styled.section`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  background: #ffffff;
  padding: 10px;
  box-sizing: border-box;
`

const Table = styled.table`
  width: 100%;

  th,
  td {
    text-align: left;
    padding: 8px;
  }

  tr:nth-of-type(even) {
    background-color: #eeeeee;
  }
`

const ClientOptions = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #dddddd;
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

const InputOptions = styled.div`
  display: flex;
  margin-top: 10px;

  div {
    margin-right: 8px;
  }
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0px;

  label {
    font-weight: bold;
    margin-right: 8px;
  }

  input {
    padding: 8px;
    border-radius: 5px;
    outline: none;
    border: 1px solid #aaaaaa;
  }
`

const CreateComplete = styled.div`
  padding: 8px;
  color: #146600;
  background: rgba(51, 255, 0, 0.1);
  border: 1px solid #33ff00;
  border-radius: 5px;
  margin-bottom: 16px;
  overflow: auto;

  p {
    margin: 0;
    margin-bottom: 5px;
    display: flex;

    strong {
      margin-right: 5px;
    }
  }
`

const CreateError = styled.div`
  padding: 8px;
  color: rgb(255, 0, 51);
  background: rgba(255, 0, 51, 0.1);
  border: 1px solid #ff0033;
  border-radius: 5px;
  margin-bottom: 16px;
`

const Clients = () => {
  const [clients, setClients] = useState<any>([])
  const [showCreate, setShowCreate] = useState(false)
  const [showCreateComplete, setShowCreateComplete] = useState(false)
  const [createDetails, setCreateDetails] = useState({
    client_id: "",
    client_secret: "",
    created_at: null,
    id: null,
    isTrusted: true,
    name: "",
    redirect_uri: "",
    updated_at: null,
  })
  const [showCreateError, setShowCreateError] = useState(false)
  const [createError, setCreateError] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientRedirect, setClientRedirect] = useState("")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const res = await getClients()
      setClients(res)
    } catch (error) {
      console.log(error)
    }
  }

  const storeClient = async () => {
    setShowCreateComplete(false)
    setShowCreateError(false)
    setCreateError("")

    try {
      const res = await createClient(clientName, clientRedirect)
      setShowCreate(false)
      setShowCreateComplete(true)
      clients.push(res.client)
      setClients([...clients])
      setCreateDetails(res.client)
    } catch (error) {
      setShowCreateError(true)
      setCreateError(error.response.data.error.error)
    }
  }

  return (
    <Container>
      <h1>Client Applications</h1>
      {showCreateComplete && (
        <CreateComplete>
          <p>
            <strong>client_id: </strong>
            <span>{createDetails.client_id}</span>
          </p>
          <p>
            <strong>client_secret: </strong>
            <span>{createDetails.client_secret}</span>
          </p>
          <p>
            <strong>name: </strong>
            <span>{createDetails.name}</span>
          </p>
          <p>
            <strong>redirect_uri: </strong>
            <span>{createDetails.redirect_uri}</span>
          </p>
        </CreateComplete>
      )}
      {showCreateError && <CreateError>{createError}</CreateError>}
      <ClientOptions>
        {!showCreate && (
          <ClientButton onClick={() => setShowCreate(!showCreate)}>
            New Client
          </ClientButton>
        )}
        {showCreate && (
          <>
            <InputContainer>
              <label>Client Name:</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </InputContainer>
            <InputContainer>
              <label>Redirect URI:</label>
              <input
                type="text"
                value={clientRedirect}
                onChange={(e) => setClientRedirect(e.target.value)}
              />
            </InputContainer>
            <InputOptions>
              <ClientButton onClick={storeClient}>Confirm</ClientButton>
              <CancelButton onClick={() => setShowCreate(!showCreate)}>
                Cancel
              </CancelButton>
            </InputOptions>
          </>
        )}
      </ClientOptions>
      <Table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Client_ID</th>
            <th>Redirect_URI</th>
            <th>Actions</th>
          </tr>
          {clients.map((client: any) => (
            <tr key={client.client_id}>
              <td>{client.name}</td>
              <td>{client.client_id}</td>
              <td>{client.redirect_uri}</td>
              <td>
                <LangLink href={`client-details?id=${client.client_id}`}>
                  <a>View</a>
                </LangLink>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default Clients
