const form = document.getElementById('searchForm');
let json = {};

form.addEventListener('submit', (event) => {
    event.preventDefault();

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
        console.log(input);
        json = parseToJson(input);
        console.log(JSON.stringify(json, null, 2));
    }

    reader.readAsText(file);
}

function parseToJson(input) {
    const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const items = [{}];
    let currentItem = items[0];

    for (const line of lines) {
        if(line.endsWith('{')) {
            const key = line.slice(0, -1).trim();
            const obj = {};
            currentItem[key] = obj;
            items.push(obj);
            currentItem = obj;
        } else if(line === '}') {
            items.pop();
            currentItem = items[items.length - 1];
        } else if(line) {
            const parts = line.split(/\s+/);
            const key = parts[0];
            const value = parts.slice(1);
            currentItem[key] = value.length > 1 ? value : value[0] || true; 
        }
        
    }

    return items[0];
}