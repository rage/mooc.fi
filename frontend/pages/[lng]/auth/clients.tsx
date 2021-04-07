import { useState, useEffect } from 'react'
import axios from 'axios'
import styled from '@emotion/styled'

const Container = styled.section``

const Clients = () => {
    const [clients, setClients] = useState([])

    return (
        <Container>
            <h1>Client Applications</h1>
            <div></div>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Client_ID</th>
                    <th>Redirect_URI</th>
                    <th>Actions</th>
                </tr>
                {clients.map((client, i) => (
                    <tr>
                        <td>{client.name}</td>
                        <td>{client.client_id}</td>
                        <td>{client.redirect_uri}</td>
                    </tr>
                ))}
            </table>
        </Container>
    )
}

export default Clients