import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import './Contact.css';

function Contact() {
  const form = useRef();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_rdepkdc',    
      'template_8vnm2m3',   
      form.current,
      'xK4AtEXJpmFbMHhEz'   
    ).then(() => {
      setSubmitted(true);
      form.current.reset();
    }).catch(error => {
      console.error('Error al enviar:', error);
    });
  };

  return (
    <div className="contact-page">
      <h2>Contacto</h2>
      <p>¿Tienes preguntas, comentarios o sugerencias? ¡Escríbenos!</p>

      {submitted && (
        <div className="success-message">
          ✅ ¡Mensaje enviado con éxito! Te responderemos pronto.
        </div>
      )}

      <form ref={form} onSubmit={handleSubmit} className="contact-form">
        <label>
          Nombre:
          <input type="text" name="name" required />
        </label>

        <label>
          Email:
          <input type="email" name="email" required />
        </label>

        <label>
          Mensaje:
          <textarea name="message" rows="5" required />
        </label>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Contact;
