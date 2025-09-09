// Global variables for movie and rating data
let movies = [];
let ratings = [];

// Genre names as defined in the u.item file
const genres = [
    "Action", "Adventure", "Animation", "Children's", "Comedy", "Crime", 
    "Documentary", "Drama", "Fantasy", "Film-Noir", "Horror", "Musical", 
    "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"
];

// Primary function to load data from files
async function loadData() {
    try {
        // Load movie data
        const moviesResponse = await fetch('u.item');
        if (!moviesResponse.ok) {
            throw new Error(`Failed to load movie data: ${moviesResponse.status}`);
        }
        const moviesText = await moviesResponse.text();
        parseItemData(moviesText);
        
        // Load rating data
        const ratingsResponse = await fetch('u.data');
        if (!ratingsResponse.ok) {
            throw new Error(`Failed to load rating data: ${ratingsResponse.status}`);
        }
        const ratingsText = await ratingsResponse.text();
        parseRatingData(ratingsText);
        
        return { movies, ratings };
    } catch (error) {
        console.error('Error loading data:', error);
        const resultElement = document.getElementById('result');
        if (resultElement) {
            resultElement.textContent = `Error: ${error.message}. Please make sure u.item and u.data files are available.`;
            resultElement.className = 'error';
        }
        throw error;
    }
}

// Parse movie data from text
function parseItemData(text) {
    movies = []; // Reset movies array
    
    const lines = text.split('\n');
    lines.forEach(line => {
        if (line.trim() === '') return;
        
        const fields = line.split('|');
        if (fields.length >= 5) {
            const id = parseInt(fields[0]);
            const title = fields[1];
            const genreFields = fields.slice(5, 24); // Get the 19 genre fields
            
            // Convert genre indicators to an array of genre names
            const movieGenres = genreFields.map((value, index) => 
                value === '1' ? genres[index] : null
            ).filter(genre => genre !== null);
            
            movies.push({
                id,
                title,
                genres: movieGenres
            });
        }
    });
}

// Parse rating data from text
function parseRatingData(text) {
    ratings = []; // Reset ratings array
    
    const lines = text.split('\n');
    lines.forEach(line => {
        if (line.trim() === '') return;
        
        const fields = line.split('\t');
        if (fields.length >= 4) {
            ratings.push({
                userId: parseInt(fields[0]),
                itemId: parseInt(fields[1]),
                rating: parseFloat(fields[2]),
                timestamp: parseInt(fields[3])
            });
        }
    });
}
