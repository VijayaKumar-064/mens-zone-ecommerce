import React, { useEffect } from 'react';
import './About.css';

const About = () => {
  useEffect(() => { document.title = 'About Us – Mens Zone'; }, []);
  return (
    <div>
      <div className="page-header"><div className="container"><h1>About Mens Zone</h1><p>Your premium destination for men's fashion</p></div></div>
      <div className="container about-layout">
        <div className="about-story">
          <h2 className="section-title">Our Story</h2>
          <p>Founded in 2019, <strong>Mens Zone</strong> was born from a simple idea: every man deserves great style without compromise. We set out to create a brand that delivers premium menswear — shirts, T-shirts, jackets, and more — that is both accessible and exceptionally crafted.</p>
          <p>Today, we serve over 10,000 happy customers across India, with a carefully curated collection designed for modern men of all ages. Whether you're dressing for the boardroom, a casual day out, or an evening with friends, Mens Zone has you covered.</p>
          <div className="about-stats-grid">
            {[['10K+','Happy Customers'],['500+','Products'],['9','Categories'],['4.8⭐','Average Rating']].map(([num, label]) => (
              <div key={label} className="about-stat"><span>{num}</span><p>{label}</p></div>
            ))}
          </div>
        </div>
        <div className="about-img-side">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80" alt="Mens Zone Store" className="about-img" />
        </div>
      </div>
      <section className="values-section">
        <div className="container">
          <h2 className="section-title text-center">Our Values</h2>
          <div className="values-grid">
            {[
              { icon:'🎯', title:'Quality First', desc:'Every garment is sourced from premium materials and undergoes strict quality checks.' },
              { icon:'🌱', title:'Sustainability', desc:'We are committed to eco-friendly packaging and responsible manufacturing practices.' },
              { icon:'💛', title:'Customer Love', desc:'Your satisfaction drives us. We offer easy returns, 24/7 support, and a 7-day replacement guarantee.' },
              { icon:'💡', title:'Innovation', desc:'We constantly update our collections to reflect the latest trends and customer feedback.' },
            ].map(v => (
              <div key={v.title} className="value-card card">
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default About;
