const httpSource = 'https://database-52211-default-rtdb.firebaseio.com/albums.json';

const getResource = async() => {
    const res = [];
    try {
        const response = await fetch(httpSource);
        const data = await response.json();
        data.forEach(({img, title, artist, songs})=> {
            res.push({img, title, artist, songs});
        });
    } catch(error) {
        console.log(`Could not fetch ${httpSource}, status: ${error.status}`);
    }
    return res;
};


export default getResource;