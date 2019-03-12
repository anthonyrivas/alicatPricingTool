// This function parses part numbers from a given input and 
// returns an object that contain unique lists of partPieces and 
// adderCodes for all part numbers.
// This function assumes that part numbers will be of the format: part-pieces/adder,codes
// and that if multiple are supplied they are separated by line breaks.
function parsePartNumbers(input) {
    //Split on line breaks
    let lineSpread = input.split(/\r?\n/)
    // map each line to an object and store it as part of the data array
    let uniquePieces = new Set()
    let uniqueAdders = new Set()
    let data = lineSpread.map((line) => {
        [partNumber, adders] = line.split('/')
        let out = {
            partPieces: [],
            adderCodes: []
        }
        if (partNumber) {
            out.partPieces = partNumber.split('-').map(part => part.trim())
        }
        if (adders) {
            out.adderCodes = adders.split(',').map(adder => adder.trim())
        }
        return out
    }).reduce((prev, part) => {
        return {
            partPieces: [...prev.partPieces, ...part.partPieces],
            adderCodes: [...prev.adderCodes, ...part.adderCodes]
        }
    }, {
            partPieces: [],
            adderCodes: []
        })
    //return data filtered to unique lists
    return {
        partPieces: data.partPieces.filter((piece) => {
            let out = !uniquePieces.has(piece)
            uniquePieces.add(piece)
            return out
        }),
        adderCodes: data.adderCodes.filter((adder) => {
            let out = !uniqueAdders.has(adder)
            uniqueAdders.add(adder)
            return out
        })
    }
}

// Fetches part pricing data from the server
function fetchParts(partData) {
    let res = axios.post('/api/parts', partData)
    return res
}

// This function uses parsePartNumbers() and fetchParts() to collect 
// pricing data about the given input.
// Pricing data is then sent to displayResults() to populate the display with
// gathered data and errors
function searchInput(input) {
    // Get part data array from inputs
    let parts = parsePartNumbers(input)
    // Fetch data for all parts and send that data to be displayed
    fetchParts(parts)
        .then(partRes => {
            displayResults(partRes.data)
        })

}

function displayResults(results) {
    // Collect references to the results and error log containers
    let resultsContainer = document.getElementById('apiOutput')
    let errorLog = document.getElementById('errorLog')
    //Empty the current resultset
    resultsContainer.innerHTML = ''
    errorLog.innerHTML = ''

    // Populate result set
    results.payload.forEach((item) => {
        let row = document.createElement('tr')
        let code = document.createElement('td')
        code.innerText = item.code
        let description = document.createElement('td')
        description.innerText = item.description
        let price = document.createElement('td')
        price.innerText = item.price
        row.append(code, description, price)
        resultsContainer.append(row)
    })

    // Populate Error Log
    results.errors.forEach((error) => {
        let item = document.createElement('li')
        item.innerText = error
        errorLog.append(item)
    })
}

// Listen for click events on the submit button and run a search based on the value entered in the text box
document.getElementById('submitButton').addEventListener('click', (event) => {
    event.preventDefault()
    let search = document.getElementById('partNumber').value
    if (search) {
        searchInput(search)
    }
}
)