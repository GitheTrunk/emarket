<template>
  <div class="about-page">
    <section class="about-hero">
      <div class="background-overlay"></div>

      <div class="container">
        <div class="hero-content">

          <h1 class="hero-title">
            Building the bridge between visionary sellers and across the globe.
          </h1>
          <p class="hero-subtitle">
            We empower entrepreneurs to scale their dreams while providing consumers
            with a curated marketplace of quality and trust.
          </p>

        </div>
      </div>
    </section>

    <section class="mission-vision">
      <div class="container">
        <div class="mission-grid">

          <div class="mission-image">
            <img src="@/assets/images/team-photos/img_5.png" alt="Team Work" />
          </div>

          <div class="mission-text">
            <span class="badge">Our Team Mission</span>
            <h2>From a Classroom Concept to a Global Marketplace</h2>
            <p>
              This is part of our
              <strong>student group project in 2025</strong>
              but we have visions and missions to prove that great ideas have no limits.
              Therefore we want expanded E-Market from a local academic challenge into a worldwide platform.
              Most importantly, we empower entrepreneurs to scale their dreams from their dorm rooms to the global stage, ensuring commerce is accessible, secure, and personal for everyone.
            </p>

          </div>

        </div>
      </div>
    </section>

    <section class="values-section">
      <div class="container">

        <div class="section-header">
          <h2>Our Key Values</h2>
          <p>The foundation of our marketplace community</p>
        </div>

        <div class="values-grid">
          <div class="value-card" v-for="value in coreValues" :key="value.title">

            <div class="value-icon">
              <i :class="value.icon"></i>
            </div>

            <h3>{{ value.title }}</h3>
            <p>{{ value.description }}</p>

          </div>
        </div>
      </div>
    </section>


    <!--team section-->
    <section class="team-section">
      <div class="container">

        <div class="section-header">
          <h2>Our Team</h2>
          <p>Meet the builders behind this project</p>
        </div>

        <div class="team-grid">

          <div class="team-card" v-for="member in team" :key="member.name">
            <div class="member-image">
              <img :src="member.image" :alt="member.name" />

              <div class="social-overlay">
                <a :href="member.githublink" target="_blank" class="social-icon">
                  <i class="fab fa-github"></i>
                </a>

                <a :href="member.linkedinlink" target="_blank" class="social-icon">
                  <i class="fab fa-linkedin"></i>
                </a>
              </div>
            </div>

            <h4>{{ member.name }}</h4>
            <p class="member-role">{{ member.role }}</p>

          </div>
        </div>
      </div>

    </section>


    <!--last section-->
    <section class="impact-banner">
      <div class="container">

        <div class="impact-content">
          <h2>Ready to be part of our story?</h2>
          <p>Join out community today.</p>
          <button class="btn btn-primary" @click="$router.push('/register')">Get Started Now</button>
        </div>

      </div>
    </section>

  </div>

</template>

<script>
export default {
  name: 'AboutUs',
  data() {
    return {
      coreValues: [
        {
          title: 'Integrity First',
          description: 'We believe transparency is the key to a healthy marketplace.',
          icon: 'fas fa-handshake'
        },

        {
          title: 'Innovation',
          description: 'Constantly improving our tech to make this application faster and easier.',
          icon: 'fas fa-lightbulb'
        },

        {
          title: 'Customer Success',
          description: 'Your growth is our growth. We succeed when you succeed.',
          icon: 'fas fa-rocket'
        }
      ],


      team: [
        {
          name: 'Bun Sengleang',
          role: 'Team Leader',
          githublink: 'https://github.com/GitheTrunk',
          linkedinlink: 'https://github.com/GitheTrunk',
          image: new URL('@/assets/images/team-photos/img.png', import.meta.url).href

        },

        {
          name: 'Keo Siengheng',
          role: 'Chief Technology Officer',
          githublink: 'https://github.com/GitheTrunk',
          linkedinlink: 'https://github.com/GitheTrunk',
          image: new URL('@/assets/images/team-photos/img_1.png', import.meta.url).href
        },

        {
          name: 'Chi Savmoeng',
          role: 'Developer',
          githublink: 'https://github.com/GitheTrunk',
          linkedinlink: 'https://github.com/GitheTrunk',
          image: new URL('@/assets/images/team-photos/img_4.png', import.meta.url).href
        },

        {
          name: 'Sok Sana',
          role: 'Developer',
          githublink: 'https://github.com/GitheTrunk',
          linkedinlink: 'https://github.com/GitheTrunk',
          image: new URL('@/assets/images/team-photos/img_3.png', import.meta.url).href
        },

        {
          name: 'Sreng Sopheakanha',
          role: 'Frontend Developer',
          githublink: 'https://github.com/ROXYTINA',
          linkedinlink: 'https://github.com/ROXYTINA',
          image: new URL('@/assets/images/team-photos/img_2.png', import.meta.url).href
        }
      ]
    }
  }
}

</script>


<style scoped>
      .about-page {
          font-family: 'Inter', sans-serif;
          color: #2c3e50;
      }

      .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 10px;
      }

      .about-hero {
          position: relative;
          padding: 80px;
          text-align: center;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;

          background-image:
            radial-gradient(circle, rgba(255, 255, 255, 0.15) 10%, transparent 10%),
            radial-gradient(circle, rgba(255, 255, 255, 0.1) 15%, transparent 15%),
            linear-gradient(250deg, #e66e00 10%, #ff9d47 100%);
          background-size: 80px 80px, 150px 150px, 100% 100%;
          background-position: 0 0, 40px 40px, 0 0;
          color: white;
      }

      .hero-content {
          max-width: 900px;
          margin: 0 auto;
          animation: fadeInUp 1s ease-out;
      }

      .badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 25px;
          display: inline-block;
      }

      .hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem); /* Responsive size */
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 25px;
      }

      .hero-subtitle {
          font-size: 1.5rem;
          opacity: 0.9;
          line-height: 1.6;
          max-width: 700px;
          margin: 0 auto 40px;
      }

      /* Subtle Entrance Animation */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }


      /* Mission Section */
      .mission-vision {
          padding: 100px 0;
      }

      .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
      }

      .mission-image img {
          width: 100%;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      }

      .badge {
          background: #fff4eb;
          color: #ff7b00;
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.9rem;
          display: inline-block;
          margin-bottom: 20px;
      }

      .mission-text h2 {
          font-size: 2.5rem;
          margin-bottom: 25px;
          line-height: 1.2;
      }

      .mission-text p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #64748b;
          margin-bottom: 30px;
      }

      /* Values Section */
      .values-section {
          padding: 100px 0;
          background-color: #f8fafc;
      }

      .section-header {
          text-align: center;
          margin-bottom: 60px;
      }

      .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 15px;
      }

      .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
      }

      .value-card {
          background: white;
          padding: 40px;
          border-radius: 15px;
          transition: transform 0.3s ease;
          text-align: center;
      }

      .value-card:hover {
          transform: translateY(-10px);
      }

      .value-icon {
          width: 70px;
          height: 70px;
          background: #ff7b00;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto 25px;
      }

      /* Team Section */
      .team-section {
          padding: 100px 0;
      }

      .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 30px;
      }

      .team-card {
          text-align: center;
      }

      .member-image {
          position: relative;
          width: 100%;
          margin-bottom: 20px;
          overflow: hidden;
          border-radius: 15px;
      }

      .member-image img {
          width: 100%;
          transition: transform 0.5s ease;
      }

      .social-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 123, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          opacity: 0;
          transition: opacity 0.3s ease;
      }

      .member-image:hover .social-overlay {
          opacity: 1;
      }

      .member-image:hover img {
          transform: scale(1.1);
      }

      .social-overlay a {
          color: white;
          font-size: 1.2rem;
      }

      .member-role {
          color: #ff7b00;
          font-weight: 600;
          font-size: 0.9rem;
      }

      /* Impact Banner */
      .impact-banner {
          padding: 80px 0;
          background: #2c3e50;
          color: white;
          text-align: center;
        }

      .btn-primary {
          background: #ff7b00;
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 30px;
      }

      @media (max-width: 768px) {
        .mission-grid {
            grid-template-columns: 1fr;
            gap: 40px;
        }
        .hero-title {
            font-size: 2.5rem;
        }
      }

</style>