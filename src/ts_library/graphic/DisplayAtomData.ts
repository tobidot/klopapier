export interface Display4ChannelAtom {
    channelR: number,
    channelG: number,
    channelB: number,
    channelA: number
}

export function atom(rgb: number, channelA?: number): Display4ChannelAtom;
export function atom(channelR: number, channelG: number, channelB: number, channelA: number): Display4ChannelAtom;
export function atom(channelR: number, channelG: number = 1, channelB?: number, channelA?: number): Display4ChannelAtom {
    if (channelB !== undefined && channelA !== undefined) {
        return {
            channelR,
            channelG,
            channelB,
            channelA
        };
    } else {
        return {
            channelR: channelR,
            channelG: channelR,
            channelB: channelR,
            channelA: channelG
        };
    }
}