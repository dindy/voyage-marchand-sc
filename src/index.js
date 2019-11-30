import data from './data'
// console.log(data)

const fromPlanet = 'planet-a'

const getBuyPricesByPlanet = (planet, data) => {
    const planetResourcesPrices = data[planet]
    const appendResourceBuyPrice = (final, currentResource) => ({
            ...final, 
            [currentResource]: planetResourcesPrices[currentResource]['buy']  
        })
    return Object.keys(planetResourcesPrices).reduce(appendResourceBuyPrice, {})
}

const buyPrices = getBuyPricesByPlanet(fromPlanet, data)

const getMaxProfitInfos = (buyPrices, data) => Object
    .keys(data)
    .reduce((final, planetName) => {

        const updateMaxProfitInfos = (final, resourceName) => {               
            const sellPrice = data[planetName][resourceName]['sell']
            const buyPrice = buyPrices[resourceName]
            const profit = sellPrice - buyPrice
            
            if(profit > final['profit']){
                return {
                    planet : planetName,
                    resource : resourceName,
                    profit
                }
            }else{
                return final
            }
        }
        
        return  Object.keys(data[planetName]).reduce(updateMaxProfitInfos, {profit: 0})
    }, {})
    
console.log(getMaxProfitInfos(buyPrices, data))


