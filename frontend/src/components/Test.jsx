import { Rocket } from '@mui/icons-material'
import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'

const Test = () => {
    return (
        <div style={{
            position: 'absolute',
            width: '100%',
            backgroundColor: 'aquamarine'
        }}>
            <Container>
                <Row style={{
                    margin: '10%',
                    width: '80%',
                    height: '500px',
                    backgroundColor: 'white',
                    textAlignLast: 'center'
                }}>
                    <Col>
                        <Row style={{backgroundColor: 'yellow', borderRadius: '20px 20px 0 0'}}>
                            <h1>Workout plan</h1>
                        </Row>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Test
