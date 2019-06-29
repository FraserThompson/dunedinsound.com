import React from 'react'
import Layout from '../components/Layout'
import { Link } from 'gatsby';

export default ({location}) => {

  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance();

    msg.voiceURI = 'native';
    msg.volume = 1;
    msg.rate = 0.1;
    msg.pitch = Math.floor(Math.random() * (2 - 0 + 1));
    msg.text = text;
    msg.lang = 'en-US';

    speechSynthesis.speak(msg);
  }

  return (
    <Layout location={location}>
      <div className="wobbly-content">
        <h1 className="big">You've hit a dead link 😭</h1>
        <p>Maybe you were looking for a particular <Link to="/gigs/">gig</Link>?</p>
      </div>
    </Layout>
  )
}
