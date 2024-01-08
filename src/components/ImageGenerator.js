import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import './ImageGenerator.css';
import Footer   from './Footer';
async function query(data) {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/prompthero/openjourney-v4',
      {
        headers: {
          Authorization: 'Bearer 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',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

const ImageGenerator = () => {
  const [textInput, setTextInput] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleImageGeneration = async () => {
    setGeneratedImage(null);
    setLoading(true);
    setError('');

    try {
      const imageUrl = await query({ inputs: textInput });
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError('Error generating image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'generated_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container className="mt-5  image-generator-container">
      <Form>
        <Form.Group as={Row} controlId="formText">
          <Form.Label column sm={2}>
            Text Input:
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              placeholder="Enter text"
              value={textInput}
              onChange={handleInputChange}
            />
          </Col>
          <Col sm={2}>
            <Button variant="primary" onClick={handleImageGeneration}>
              Generate
            </Button>
          </Col>
        </Form.Group>
      </Form>

      {loading && <p>Loading Image...</p>}

      {error && <p className="text-danger">{error}</p>}

      {generatedImage && (
        <Row className="mt-3">
          <Col md={4} className="mb-4">
            <Image
              src={generatedImage}
              alt="Generated Image"
              fluid
              className="generated-image"
            />
          </Col>
        </Row>
      )}

      {generatedImage && (
        <Row>
          <Col>
            <Button variant="success" onClick={handleDownload} className="download-button">
              Download Image
            </Button>
          </Col>
        </Row>
      )}
      <Footer />
    </Container>
  );
};

export default ImageGenerator;
