document.addEventListener('DOMContentLoaded', function() {
  var typingText = 'B2DevUK, a Developer, a Designer, a Creator.';
  var typingSpeed = 50;
  var deletingSpeed = 30;
  var pause = 2000;
  var i = 0;
  var isDeleting = false;
  var typingColor = '#98C379';

  var typingEffect = function() {
      var current = typingText.substr(0, i);
      var typingElement = document.getElementById('typing');
      typingElement.innerHTML = current;
      typingElement.style.color = typingColor; 

      if (isDeleting) {
          if (i > 0) {
              i--;
              setTimeout(typingEffect, deletingSpeed);
          } else {
              isDeleting = false;
              setTimeout(typingEffect, pause);
          }
      } else {
          if (i < typingText.length) {
              i++;
              setTimeout(typingEffect, typingSpeed);
          } else {
              isDeleting = true;
              setTimeout(typingEffect, pause);
          }
      }
  };

  setTimeout(typingEffect, typingSpeed);

  fetch('locale/aboutMeContent.json')
      .then(response => response.json())
      .then(data => {
          const storyboard = document.getElementById('storyboard');
          data.stories.forEach(story => {
              const storyDiv = document.createElement('div');
              storyDiv.className = `story story-${story.position}`;
              storyDiv.innerHTML = `
                  <img src="${story.imgSrc}" alt="${story.imgAlt}">
                  <p>${story.text}</p>
              `;
              storyboard.appendChild(storyDiv);
          });
      })
      .catch(error => console.error('Error loading the story content:', error));

  fetch('locale/clients.json')
      .then(response => response.json())
      .then(data => {
          populateClients('currentClients', data.currentClients);
          populateClients('pastClients', data.pastClients);
      })
      .catch(error => console.error('Error loading clients data:', error));

  fetch('locale/projects.json')
      .then(response => response.json())
      .then(data => populateProjects(data.projects))
      .catch(error => console.error('Error loading project data:', error));
  
  fetch('locale/skills.json')
      .then(response => response.json())
      .then(data => populateSkills(data.skills))
      .catch(error => console.error('Error loading skills data:', error));

  const form = document.getElementById("contact-form");

  form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const formObject = Object.fromEntries(formData);

      fetch(form.action, {
          method: "POST",
          headers: {
              Accept: "application/json",
          },
          body: formData,
      })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  alert("Thank you for your message!");
                  form.reset(); // Reset form fields after successful submission
              } else {
                  alert("There was a problem with your submission. Please try again.");
              }
          })
          .catch(error => alert("There was a problem with your submission: " + error));
  });

  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.top-nav .main-nav ul');

  burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active'); // Toggle menu display

    // Burger Animation
    burger.classList.toggle('toggle');
  });
});

function populateClients(containerId, clients) {
  const container = document.getElementById(containerId);

  clients.forEach(client => {
    const clientDiv = document.createElement('div');
    clientDiv.className = 'client-container';

    // Company Name
    const companyName = document.createElement('p');
    companyName.innerHTML = `<strong>${client.company}</strong>`;
    companyName.className = 'client-company';

    // Location
    const location = document.createElement('p');
    location.textContent = client.location;
    location.className = 'client-location';

    // Skills
    const skills = document.createElement('p');
    skills.textContent = `Skills: ${client.skills.join(', ')}`;
    skills.className = 'client-skills';

    // Icons
    const iconsDiv = document.createElement('div');
    iconsDiv.className = 'client-icons';
    client.icons.forEach(iconName => {
      const iconImg = document.createElement('img');
      iconImg.src = `img/icons/${iconName}.png`;
      iconImg.alt = iconName; // Accessibility alt text
      iconsDiv.appendChild(iconImg);
    });

    // Appending each part to the client container
    clientDiv.appendChild(companyName);
    clientDiv.appendChild(location);
    clientDiv.appendChild(skills);
    clientDiv.appendChild(iconsDiv);

    // Append the client container to the section container
    container.appendChild(clientDiv);
  });
}

function populateProjects(projects) {
  const container = document.getElementById('works');

  projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';

    // Project Summary
    const projectSummary = document.createElement('div');
    projectSummary.className = 'project-summary';
    projectSummary.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <a href="${project.githubLink}" target="_blank" style="color: #98C379;">View on GitHub</a>
    `;

    // Project Details (Initially hidden)
    const projectDetails = document.createElement('div');
    projectDetails.className = 'project-details hidden';
    
    // Images
    const projectImages = document.createElement('div');
    projectImages.className = 'project-images';
    project.images.forEach(image => {
      const img = document.createElement('img');
      img.src = image;
      img.alt = `Image for ${project.title}`;
      projectImages.appendChild(img);
    });

    // Code Examples
    const codeExamples = document.createElement('div');
    codeExamples.className = 'code-examples';
    project.codeExamples.forEach(code => {
      const pre = document.createElement('pre');
      pre.textContent = code;
      codeExamples.appendChild(pre);
    });


    // Project Breakdown
    const breakdown = document.createElement('p');
    breakdown.className = 'project-breakdown';
    breakdown.textContent = project.breakdown;

    // Skills Used
    const skillsUsed = document.createElement('ul');
    skillsUsed.className = 'skills-used';
    project.skills.forEach(skill => {
      const skillItem = document.createElement('li');
      skillItem.textContent = skill;
      skillsUsed.appendChild(skillItem);
    });

    // Icons
    const iconsDiv = document.createElement('div');
    iconsDiv.className = 'project-icons';
    project.icons.forEach(iconName => {
      const iconImg = document.createElement('img');
      iconImg.src = `img/icons/${iconName}.png`;
      iconImg.alt = iconName; // Accessibility alt text
      iconsDiv.appendChild(iconImg);
    });

    // Append all details to projectDetails
    projectDetails.appendChild(projectImages);
    projectDetails.appendChild(codeExamples);
    projectDetails.appendChild(breakdown);
    projectDetails.appendChild(skillsUsed);
    projectDetails.appendChild(iconsDiv);

    // Append summary and details to card, then card to container
    projectCard.appendChild(projectSummary);
    projectCard.appendChild(projectDetails);
    container.appendChild(projectCard);
  });
}

function populateSkills(skills) {
  const container = document.getElementById('skills').querySelector('.skills-container');
  container.className += ' skills-grid';

  skills.forEach(skill => {
    const skillDiv = document.createElement('div');
    skillDiv.className = 'skill-card';

    const iconImg = createElement('img', {src: skill.icon, alt: `${skill.title} Icon`, className: 'skill-icon'});
    const title = createElement('h3', {}, [skill.title]);
    const description = createElement('p', {className: 'skill-description'}, [skill.description]);
    const proficiency = createElement('p', {className: 'skill-proficiency'}, [`Proficiency: ${skill.proficiency}`]);
    const toolsDiv = createElement('div', {className: 'skill-tools'});
    skill.tools.forEach(tool => {
      // Create an anchor element for each tool linking to its official page
      const toolLink = createElement('a', {href: tool.url, className: 'skill-tool', target: "_blank"}, [tool.name]);
      toolsDiv.appendChild(toolLink);
    });

    skillDiv.appendChild(iconImg);
    skillDiv.appendChild(title);
    skillDiv.appendChild(description);
    skillDiv.appendChild(proficiency);
    skillDiv.appendChild(toolsDiv);
    container.appendChild(skillDiv);
  });
}

function createElement(type, properties = {}, children = []) {
  const element = document.createElement(type);
  Object.entries(properties).forEach(([key, value]) => {
    if (key === 'className') element.className = value;
    else if (key === 'src') element.src = value;
    else if (key === 'alt') element.alt = value;
    else element.setAttribute(key, value);
  });
  children.forEach(child => element.appendChild(typeof child === 'string' ? document.createTextNode(child) : child));
  return element;
}