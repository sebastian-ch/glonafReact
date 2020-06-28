export const fillColorScheme = () => {

    return {
        property: 'taxCount',
        stops: [
            [146, "#edf8fb"],
            [409, "#b2e2e2"],
            [774, "#66c2a4"],
            [1233, "#2ca25f"],
            [3301, "#006d2c"]

        ]
      /*  stops: [
            [146, "#edf8fb"],
            [409, "#b2e2e2"],
            [774, "#66c2a4"],
            [1233, "#2ca25f"]
        ] */
    }

}

export const circleFill = () => {
    return {
        'circle-radius': 4.0,
        'circle-color': fillColorScheme(),
        "circle-stroke-width": 1,
        "circle-stroke-color": 'black'

        }
}

export const bigFill = () => {
    return {

        'fill-color': fillColorScheme(),
        'fill-opacity': 0.8,
        'fill-outline-color': 'black'
    }

}

export const smallFill = () => {
    return {
        'fill-color': fillColorScheme(),
        'fill-outline-color': 'black',
        'fill-opacity': 0.8,

    }
}
