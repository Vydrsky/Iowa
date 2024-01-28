import {  CardResponse, RoundResponse } from "../../../generated/models";

export default class RoundTable {
    round: RoundResponse;
    card: CardResponse;

    constructor(r: RoundResponse, c: CardResponse) {
        this.round = r;
        this.card = c;
    }
}