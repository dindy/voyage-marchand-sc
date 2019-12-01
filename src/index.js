import data from './data'

const fromPlanet = 'planet-a'
var bestTravel = { path: [], profit: 0 }

const getBuyPricesByPlanetFromData = (planet, data) => {
    return getActionKeysPricesByPlanetFromData(planet, 'buy', data)
}

const getSellPricesByPlanetFromData = (planet, data) => {
    return getActionKeysPricesByPlanetFromData(planet, 'sell', data)
}

const getActionKeysPricesByPlanetFromData = (planet, actionKey, data) => {
    const planetResourcesPrices = data[planet]
    const appendResourceBuyPrice = (final, currentResource) => ({
            ...final, 
            [currentResource]: planetResourcesPrices[currentResource][actionKey]  
        })
    return Object.keys(planetResourcesPrices).reduce(appendResourceBuyPrice, {})
}

// const getMaxProfitInfos = (buyPrices, data) => Object
//     .keys(data)
//     .reduce((final, planetName) => {

//         const updateMaxProfitInfos = (final, resourceName) => {               
//             const sellPrice = data[planetName][resourceName]['sell']
//             const buyPrice = buyPrices[resourceName]
//             const profit = buyPrice - sellPrice 
            
//             if(profit > final['profit']){
//                 return {
//                     planet : planetName,
//                     resource : resourceName,
//                     profit
//                 }
//             }else{
//                 return final
//             }
//         }
        
//         return  Object.keys(data[planetName]).reduce(updateMaxProfitInfos, {profit: 0})
//     }, {})

const getAllTravelProfit = (currentPlanetName, jumps, jumpCounter, previousPath, previousProfit = 0) => {
    
    const getProfitByPlanetObject = (final, planetDestinationName) => {

        const buyPrices = getBuyPricesByPlanetFromData(currentPlanetName, data)
        const sellPrices = getSellPricesByPlanetFromData(planetDestinationName, data)
        
        return {
            ...final,
            [planetDestinationName]: Object.keys(buyPrices)

                // Les bénéfices pour chaque resource
                // [{resournceName, profit}]
                .map(resourceName => ({
                    resourceName,
                    profit: sellPrices[resourceName] - buyPrices[resourceName] 
                }))

                // Garde le meilleur bénéfice
                // {resourceName, profit, globalProfit}
                .reduce((final, transaction) => {

                    if (transaction['profit'] > final['profit']) {
                        return {
                            path: final['path'],
                            resourceName : transaction['resourceName'],
                            profit: transaction['profit'],
                            globalProfit: previousProfit + transaction['profit'] 
                        }
                    } else {
                        return final
                    }                
                }, { 
                    path: [...previousPath, planetDestinationName], 
                    globalProfit: previousProfit, 
                    profit: 0, 
                    resourceName: null 
                })
        }

    }

    const destinations = Object
        .keys(data)
        .filter(planetName => planetName !== currentPlanetName)
        .reduce(getProfitByPlanetObject, {})
    
    if (jumpCounter < jumps) {
        return Object
            .keys(destinations)
            .reduce((final, planetDestinationName) => {
                const allTravelProfits = getAllTravelProfit(
                    planetDestinationName, 
                    jumps, 
                    jumpCounter + 1,
                    destinations[planetDestinationName]['path'],
                    destinations[planetDestinationName]['globalProfit'],
                )
                
                Object.keys(allTravelProfits)
                    .filter( key => key !== 'transaction' )
                    .forEach( key => {

                        const globalProfit = typeof allTravelProfits[key]['globalProfit'] === "undefined" ?
                            allTravelProfits[key]['transaction']['globalProfit'] : 
                            allTravelProfits[key]['globalProfit']

                        const path = typeof allTravelProfits[key]['path'] === "undefined" ?
                            allTravelProfits[key]['transaction']['path'] : 
                            allTravelProfits[key]['path']
                        
                        if (globalProfit > bestTravel['profit']) {
                            bestTravel = {
                                path,
                                profit: globalProfit
                            }
                        }
                        
                    })

                const knownDestinations = {
                    ...final,
                    [planetDestinationName]: {
                        transaction: destinations[planetDestinationName], 
                        ...allTravelProfits 
                    }
                }

                return knownDestinations
            }, {})
    }
    return destinations
    
}

let allTravelProfit = getAllTravelProfit(fromPlanet, 9, 1, [])

bestTravel.path
    .reduce((final, planetName) => {
        const transaction = typeof final[planetName].transaction === 'undefined' ?
            final[planetName] : final[planetName].transaction
        if (transaction.resourceName === null) {
            console.log('Aller sur ' + planetName + ' pour ne rien vendre.');
        } else {
            console.log('Aller sur ' + planetName + ' pour vendre ' + transaction.resourceName + ' avec un profit de ' + transaction['profit']);
        }
        return final[planetName]
    }, allTravelProfit)
    
    console.log(allTravelProfit)
    console.log(bestTravel)