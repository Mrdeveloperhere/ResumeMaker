// Experience counter
let experienceCount = 0;
let educationCount = 0;

// Helper function to escape HTML and prevent XSS
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Helper function to validate and sanitize URLs
function isValidUrl(string) {
    try {
        const url = new URL(string);
        // Only allow http and https protocols
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data first
    loadSavedData();
    
    // Add initial experience and education items if none loaded
    if (document.querySelectorAll('.experience-item').length === 0) {
        addExperience();
    }
    if (document.querySelectorAll('.education-item').length === 0) {
        addEducation();
    }
    
    // Add event listeners to all form inputs
    setupEventListeners();
    
    // Add template change listener
    document.querySelectorAll('input[name="template"]').forEach(radio => {
        radio.addEventListener('change', changeTemplate);
    });
    
    // Update preview with any loaded data
    updatePreview();
});

// Setup event listeners for real-time preview
function setupEventListeners() {
    // Personal Information
    document.getElementById('fullName').addEventListener('input', updatePreview);
    document.getElementById('title').addEventListener('input', updatePreview);
    document.getElementById('email').addEventListener('input', updatePreview);
    document.getElementById('phone').addEventListener('input', updatePreview);
    document.getElementById('location').addEventListener('input', updatePreview);
    document.getElementById('linkedin').addEventListener('input', updatePreview);
    document.getElementById('website').addEventListener('input', updatePreview);
    document.getElementById('summary').addEventListener('input', updatePreview);
    document.getElementById('skills').addEventListener('input', updatePreview);
}

// Update preview in real-time
function updatePreview() {
    // Personal Information
    const fullName = document.getElementById('fullName').value;
    const title = document.getElementById('title').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const linkedin = document.getElementById('linkedin').value;
    const website = document.getElementById('website').value;
    
    document.getElementById('preview-name').textContent = fullName || 'Your Name';
    document.getElementById('preview-name').className = fullName ? '' : 'preview-placeholder';
    
    document.getElementById('preview-title').textContent = title || 'Your Professional Title';
    document.getElementById('preview-title').className = title ? '' : 'preview-placeholder';
    
    document.getElementById('preview-email').textContent = email || 'email@example.com';
    document.getElementById('preview-email').className = email ? '' : 'preview-placeholder';
    
    document.getElementById('preview-phone').textContent = phone || '+1 (555) 123-4567';
    document.getElementById('preview-phone').className = phone ? '' : 'preview-placeholder';
    
    document.getElementById('preview-location').textContent = location || 'City, State';
    document.getElementById('preview-location').className = location ? '' : 'preview-placeholder';
    
    // Links
    if (linkedin && isValidUrl(linkedin)) {
        document.getElementById('preview-linkedin').innerHTML = `<a href="${linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`;
    } else {
        document.getElementById('preview-linkedin').textContent = '';
    }
    
    if (website && isValidUrl(website)) {
        document.getElementById('preview-website').innerHTML = `<a href="${website}" target="_blank" rel="noopener noreferrer">Website</a>`;
    } else {
        document.getElementById('preview-website').textContent = '';
    }
    
    // Professional Summary
    const summary = document.getElementById('summary').value;
    const summarySection = document.getElementById('preview-summary-section');
    if (summary) {
        document.getElementById('preview-summary').textContent = summary;
        summarySection.style.display = 'block';
    } else {
        summarySection.style.display = 'none';
    }
    
    // Skills
    const skills = document.getElementById('skills').value;
    const skillsSection = document.getElementById('preview-skills-section');
    const skillsContainer = document.getElementById('preview-skills');
    
    if (skills) {
        const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
        skillsContainer.innerHTML = skillsArray.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
        skillsSection.style.display = 'block';
    } else {
        skillsSection.style.display = 'none';
    }
    
    // Update experience and education
    updateExperiencePreview();
    updateEducationPreview();
}

// Add experience entry
function addExperience() {
    experienceCount++;
    const container = document.getElementById('experienceContainer');
    const experienceHTML = `
        <div class="experience-item" id="experience-${experienceCount}">
            <button type="button" class="remove-btn" onclick="removeExperience(${experienceCount})">×</button>
            <input type="text" class="form-input exp-title" placeholder="Job Title" data-id="${experienceCount}">
            <input type="text" class="form-input exp-company" placeholder="Company Name" data-id="${experienceCount}">
            <input type="text" class="form-input exp-date" placeholder="Date Range (e.g., Jan 2020 - Present)" data-id="${experienceCount}">
            <textarea class="form-textarea exp-description" placeholder="Describe your responsibilities and achievements..." rows="3" data-id="${experienceCount}"></textarea>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', experienceHTML);
    
    // Add event listeners to new inputs
    const newItem = document.getElementById(`experience-${experienceCount}`);
    newItem.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

// Remove experience entry
function removeExperience(id) {
    const item = document.getElementById(`experience-${id}`);
    if (item) {
        item.remove();
        updatePreview();
    }
}

// Update experience preview
function updateExperiencePreview() {
    const experienceItems = document.querySelectorAll('.experience-item');
    const previewContainer = document.getElementById('preview-experience');
    const experienceSection = document.getElementById('preview-experience-section');
    
    let hasExperience = false;
    let html = '';
    
    experienceItems.forEach(item => {
        const title = item.querySelector('.exp-title').value;
        const company = item.querySelector('.exp-company').value;
        const date = item.querySelector('.exp-date').value;
        const description = item.querySelector('.exp-description').value;
        
        if (title || company || date || description) {
            hasExperience = true;
            html += `
                <div class="experience-entry">
                    <div class="entry-header">
                        <span class="entry-title">${title || 'Job Title'}</span>
                        <span class="entry-date">${date || 'Date Range'}</span>
                    </div>
                    <div class="entry-subtitle">${company || 'Company Name'}</div>
                    ${description ? `<div class="entry-description">${description}</div>` : ''}
                </div>
            `;
        }
    });
    
    if (hasExperience) {
        previewContainer.innerHTML = html;
        experienceSection.style.display = 'block';
    } else {
        experienceSection.style.display = 'none';
    }
}

// Add education entry
function addEducation() {
    educationCount++;
    const container = document.getElementById('educationContainer');
    const educationHTML = `
        <div class="education-item" id="education-${educationCount}">
            <button type="button" class="remove-btn" onclick="removeEducation(${educationCount})">×</button>
            <input type="text" class="form-input edu-degree" placeholder="Degree (e.g., Bachelor of Science)" data-id="${educationCount}">
            <input type="text" class="form-input edu-school" placeholder="School/University Name" data-id="${educationCount}">
            <input type="text" class="form-input edu-date" placeholder="Graduation Date (e.g., May 2020)" data-id="${educationCount}">
            <input type="text" class="form-input edu-gpa" placeholder="GPA or Honors (optional)" data-id="${educationCount}">
        </div>
    `;
    container.insertAdjacentHTML('beforeend', educationHTML);
    
    // Add event listeners to new inputs
    const newItem = document.getElementById(`education-${educationCount}`);
    newItem.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

// Remove education entry
function removeEducation(id) {
    const item = document.getElementById(`education-${id}`);
    if (item) {
        item.remove();
        updatePreview();
    }
}

// Update education preview
function updateEducationPreview() {
    const educationItems = document.querySelectorAll('.education-item');
    const previewContainer = document.getElementById('preview-education');
    const educationSection = document.getElementById('preview-education-section');
    
    let hasEducation = false;
    let html = '';
    
    educationItems.forEach(item => {
        const degree = item.querySelector('.edu-degree').value;
        const school = item.querySelector('.edu-school').value;
        const date = item.querySelector('.edu-date').value;
        const gpa = item.querySelector('.edu-gpa').value;
        
        if (degree || school || date || gpa) {
            hasEducation = true;
            html += `
                <div class="education-entry">
                    <div class="entry-header">
                        <span class="entry-title">${degree || 'Degree'}</span>
                        <span class="entry-date">${date || 'Graduation Date'}</span>
                    </div>
                    <div class="entry-subtitle">${school || 'School Name'}</div>
                    ${gpa ? `<div class="entry-description">${gpa}</div>` : ''}
                </div>
            `;
        }
    });
    
    if (hasEducation) {
        previewContainer.innerHTML = html;
        educationSection.style.display = 'block';
    } else {
        educationSection.style.display = 'none';
    }
}

// Change template
function changeTemplate(e) {
    const preview = document.getElementById('resumePreview');
    preview.className = `resume-preview ${e.target.value}`;
}

// Clear form
function clearForm() {
    if (confirm('Are you sure you want to clear all fields? This action cannot be undone.')) {
        // Clear all inputs
        document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.value = '';
        });
        
        // Remove all experience and education items
        document.getElementById('experienceContainer').innerHTML = '';
        document.getElementById('educationContainer').innerHTML = '';
        
        // Reset counters
        experienceCount = 0;
        educationCount = 0;
        
        // Add one of each back
        addExperience();
        addEducation();
        
        // Update preview
        updatePreview();
    }
}

// Save data to localStorage (auto-save functionality)
function autoSave() {
    const data = {
        fullName: document.getElementById('fullName').value,
        title: document.getElementById('title').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        linkedin: document.getElementById('linkedin').value,
        website: document.getElementById('website').value,
        summary: document.getElementById('summary').value,
        skills: document.getElementById('skills').value,
        experience: [],
        education: []
    };
    
    // Save experience entries
    document.querySelectorAll('.experience-item').forEach(item => {
        const expData = {
            id: item.id.split('-')[1],
            title: item.querySelector('.exp-title').value,
            company: item.querySelector('.exp-company').value,
            date: item.querySelector('.exp-date').value,
            description: item.querySelector('.exp-description').value
        };
        data.experience.push(expData);
    });
    
    // Save education entries
    document.querySelectorAll('.education-item').forEach(item => {
        const eduData = {
            id: item.id.split('-')[1],
            degree: item.querySelector('.edu-degree').value,
            school: item.querySelector('.edu-school').value,
            date: item.querySelector('.edu-date').value,
            gpa: item.querySelector('.edu-gpa').value
        };
        data.education.push(eduData);
    });
    
    // Save selected template
    const selectedTemplate = document.querySelector('input[name="template"]:checked');
    if (selectedTemplate) {
        data.template = selectedTemplate.value;
    }
    
    localStorage.setItem('resumeData', JSON.stringify(data));
}

// Load data from localStorage
function loadSavedData() {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
        const data = JSON.parse(saved);
        
        // Load personal information
        document.getElementById('fullName').value = data.fullName || '';
        document.getElementById('title').value = data.title || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('location').value = data.location || '';
        document.getElementById('linkedin').value = data.linkedin || '';
        document.getElementById('website').value = data.website || '';
        document.getElementById('summary').value = data.summary || '';
        document.getElementById('skills').value = data.skills || '';
        
        // Load experience entries
        if (data.experience && data.experience.length > 0) {
            data.experience.forEach(exp => {
                addExperience();
                const item = document.querySelector('.experience-item:last-child');
                item.querySelector('.exp-title').value = exp.title || '';
                item.querySelector('.exp-company').value = exp.company || '';
                item.querySelector('.exp-date').value = exp.date || '';
                item.querySelector('.exp-description').value = exp.description || '';
            });
        }
        
        // Load education entries
        if (data.education && data.education.length > 0) {
            data.education.forEach(edu => {
                addEducation();
                const item = document.querySelector('.education-item:last-child');
                item.querySelector('.edu-degree').value = edu.degree || '';
                item.querySelector('.edu-school').value = edu.school || '';
                item.querySelector('.edu-date').value = edu.date || '';
                item.querySelector('.edu-gpa').value = edu.gpa || '';
            });
        }
        
        // Load template selection
        if (data.template) {
            const templateRadio = document.querySelector(`input[name="template"][value="${data.template}"]`);
            if (templateRadio) {
                templateRadio.checked = true;
                changeTemplate({ target: templateRadio });
            }
        }
    }
}

// Auto-save every 5 seconds
setInterval(autoSave, 5000);
