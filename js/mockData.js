// Data generation logic only
const generateMockData = (count, sourceName) => {
    const roles = ['Frontend Dev', 'Backend Dev', 'UI/UX Designer', 'Data Scientist'];
    const locations = ['Chennai', 'Bangalore', 'Hyderabad', 'Remote'];
    let data = [];
    for(let i=0; i<count; i++) {
        data.push({
            id: i,
            name: `Candidate ${i + (sourceName === 'LI' ? 10 : 0)}`,
            email: `user${i}@example.com`, // Cross-source duplicates for testing
            location: locations[Math.floor(Math.random() * locations.length)],
            role: roles[Math.floor(Math.random() * roles.length)],
            exp: Math.floor(Math.random() * 10) + " Years",
            source: sourceName
        });
    }
    return data;
};

// Exporting the data to be used in script.js
const internalATS = generateMockData(30, 'ATS');
const linkedInDB = generateMockData(25, 'LI');
