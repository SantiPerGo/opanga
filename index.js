const form = document.getElementById('searchForm');
let json = {};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const container = document.getElementById('resultContainer');
    container.style.display = 'block';

    const text = document.getElementById('searchText').value;
    const result = findInJson(json, text);

    document.getElementById('result').innerHTML = result ?
        JSON.stringify(result, null, 2) : 'No se encontraron resultados.';
});

function findInJson(json, text) {
    for(const key in json) {
        if(key === text)
            return json[key];

        if(typeof json[key] === 'object' && json[key] !== null) {
            const item = findInJson(json[key], text);
            if(item) return item;
        }
    }

    return null;
}

function handleFileSelect() {
    const fileLoader = document.getElementById('fileLoader');
    const file = fileLoader.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const input = reader.result;
        const errorContainer = document.getElementById('errorContainer');

        try {
            console.log(input);
            json = parseToJson(input);
            console.log(JSON.stringify(json, null, 2));
            errorContainer.textContent = '';
        } catch(error) {
            fileLoader.value = '';
            errorContainer.textContent = error;
        }
    }

    reader.readAsText(file);
}

function parseToJson(input) {
    const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const items = [{}];
    let currentItem = items[0];
    const curlySections = [];

    for (const line of lines) {
        const parts = line.split(/\s+/);
        const key = parts[0];

        if(currentItem[key])            
            throw new Error('El archivo contiene una clave duplicada: ' + key);

        if(line.endsWith('{')) {
            const obj = {};
            currentItem[key] = obj;
            items.push(obj);
            currentItem = obj;
            curlySections.push(true);
        } else if(line === '}') {
            if(curlySections.length > 0) {
                curlySections.pop();
                items.pop();
                currentItem = items[items.length - 1];
            } else
                throw new Error('Hay una llave de cierre } sin una llave de apertura correspondiente');
        } else if(line) {
            const value = parts.slice(1);             
            currentItem[key] = value.length > 1 ? value : value[0] || key;
        }
    }

    if(curlySections.length > 0)
        throw new Error('Hay una llave de apertura { sin una llave de cierre correspondiente');

    return items[0];
}