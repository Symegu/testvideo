export enum Resolutions {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160',
}

export type ResolutionsString = keyof typeof Resolutions
// const x = Resolutions.P144
// const y = Resolutions[x]
// const z = Resolutions['P144']

export type OutputVideoType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: null
    createdAt: string
    publicationDate: string
    availableResolution: Resolutions[]
}

export type InputVideoType = {
    title: string
    author: string
    availableResolution: Resolutions[]
}