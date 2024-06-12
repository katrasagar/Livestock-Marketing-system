document.addEventListener('DOMContentLoaded', function() {
    const animalList = document.getElementById('animal-list');
    const listingForm = document.getElementById('listing-form');
    const priceInput = document.getElementById('price');

    // Function to create a listing element from animal data
    function createListing(animal) {
        const listItem = document.createElement('li');
        const image = document.createElement('img');
        const infoDiv = document.createElement('div');
        const title = document.createElement('h3');
        const price = document.createElement('p');
        const description = document.createElement('p');
        const contact = document.createElement('p');
    
        image.src = animal.image;
        image.alt = animal['animal-type']; // Use the correct property name
    
        title.textContent = animal['animal-type']; // Use the correct property name
        price.textContent = `KSH ${animal.price.toFixed(3)}`;
        description.textContent = animal.description;
        
        // Check if the 'phoneNumber' property exists, and use it if it does
    if (animal.phoneNumber) {
        contact.textContent = `Contact Seller: ${animal.phoneNumber}`;
    } else {
        contact.textContent = `Contact Seller: ${animal.contact}`;
    }
    
        infoDiv.appendChild(title);
        infoDiv.appendChild(price);
        infoDiv.appendChild(description);
        infoDiv.appendChild(contact);
    
        listItem.appendChild(image);
        listItem.appendChild(infoDiv);
    
        animalList.appendChild(listItem);
    }

    // Load livestock data from db.json
    fetch('http://localhost:3000/livestock')
        .then(response => response.json())
        .then(data => {
            data.forEach(animal => {
                createListing(animal);
            });
        })
        .catch(error => {
            console.error('Error loading livestock data:', error);
        });

    // Handle form submission for adding new listings
    listingForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const newListing = {
            id: Math.floor(Math.random() * 10000) + 1,
            animalType: formData.get('animal-type'),
            image: URL.createObjectURL(formData.get('animal-image')),
            price: parseFloat(formData.get('price')),
            description: formData.get('description'),
            contact: formData.get('contact')
        };

        // Add the new listing to the UI
        createListing(newListing);

        // Persist the new listing to localStorage (replace with server-side storage for production)
        const storedListings = JSON.parse(localStorage.getItem('listings')) || [];
        storedListings.push(newListing);
        localStorage.setItem('listings', JSON.stringify(storedListings));

        // Clear the form
        listingForm.reset();
    });

    // Validate price input on keyup event (optional)
    priceInput.addEventListener('keyup', function() {
        const priceValue = parseFloat(priceInput.value);
        if (isNaN(priceValue) || priceValue <= 0) {
            priceInput.classList.add('error'); // Add error class for styling (add CSS)
        } else {
            priceInput.classList.remove('error');
        }
    });
});