import { TileAssets } from "@/components/AAC/TileTypes";
import office from "../office/office";

export const JOB_TILES_COLOR = "blue";

const job: TileAssets ={
    job: {
        image: "/AAC_assets/img/this/job.png",
        text: "Job",
        sound: "Job",
        tileColor: "orange",
    },
    money: {
        image: "/AAC_assets/img/job/money.png",
        text: "Money",
        sound: "Money",
        tileColor: "orange",
    },
    office: {
        image: "/AAC_assets/img/job/office.png",
        text: "Office",
        sound: "Office",
        tileColor: "blue",
        subTiles: office,
    },
    work: {
        image: "/AAC_assets/img/job/work.png",
        text: "Work",
        sound: "Work",
        tileColor: JOB_TILES_COLOR,
    },
    trade: {
        image: "/AAC_assets/img/job/trade.png",
        text: "Trade",
        sound: "Trade",
        tileColor: JOB_TILES_COLOR,
    },
    sell: {
        image: "/AAC_assets/img/job/sell.png",
        text: "Sell",
        sound: "Sell",
        tileColor: JOB_TILES_COLOR,
    },
    buy: {
        image: "/AAC_assets/img/job/buy.png",
        text: "Buy",
        sound: "Buy",
        tileColor: JOB_TILES_COLOR,
    }
}
export default job;
