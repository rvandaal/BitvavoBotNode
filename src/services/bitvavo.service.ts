import { TickerPriceResponse } from '../response-models/ticker-price-reponse';
import { AssetResponse } from '../response-models/asset-response';
import { BalanceResponse } from '../response-models/balance-response';
import { TradeResponse } from '../response-models/trade-response';
import { TickerPrice24hResponse } from '../response-models/ticker-price-24h-response';
import { PlaceOrderResponse } from '../response-models/place-order-response';
import { OpenOrderResponse } from '../response-models/open-order-response';
import { FeeResponse } from '../response-models/fee-reponse';
import { CandleResponse } from '../response-models/candle-response';

const { bitvavo } = require('./bitvavo-api');

// Reponsible for converting raw data into response models.

export class BitvavoService {

    constructor() { }

    public async getFees(): Promise<FeeResponse> {
        const response = await bitvavo.account();
        return new FeeResponse(response);
    }

    public async getAssets(): Promise<AssetResponse[]> {
        try {
            if (this.ensurePositiveLimit()) {
                const list: AssetResponse[] = [];
                const response = await bitvavo.assets({});
                // tslint:disable-next-line: prefer-const
                for (let item of response) {
                    if (!['AE', 'DASH'].includes(item.symbol)) {
                        list.push(new AssetResponse(item));
                    }
                }
                return list;
            }
            return [];
        } catch (error) {
            return Promise.reject();
        }
    }

    public async getBalance(symbol?: string): Promise<BalanceResponse[]> {
        try {
            if (this.ensurePositiveLimit()) {
                const list: BalanceResponse[] = [];
                const response = await bitvavo.balance(symbol ? { symbol } : {});
                // tslint:disable-next-line: prefer-const
                for (let item of response) {
                    if (!['AE', 'DASH'].includes(item.symbol)) {
                        list.push(new BalanceResponse(item));
                    }
                }
                return list;
            }
            return [];
        } catch (error) {
            return Promise.reject();
        }

        // bitvavo.placeOrder('ETH-EUR', 'buy', 'limit', { amount: '3', price: '2' }, (error, response) => {
        //   if (error === null) {
        //     console.log(response)
        //   } else {
        //     console.log(error)
        //   }
        // })
    }

    public async getCandles(market: string, interval: string): Promise<CandleResponse[]> {
        try {
            if (this.ensurePositiveLimit()) {
                const list: CandleResponse[] = [];
                const response = await bitvavo.candles(market, interval);
                for (const item of response) {
                    list.push(new CandleResponse(item));
                }
                return list;
            }
            return [];
        } catch (error) {
            return Promise.reject();
        }
    }

    public async placeBuyOrder(
        market: string,
        tradeAmount: number,
        tradePrice: number | undefined,
        tradeTriggerPrice: number | undefined,
        decimals: number,
        priceDecimals: number
    ): Promise<PlaceOrderResponse> {
        return this.placeOrder(market, true, tradeAmount, tradePrice, tradeTriggerPrice, decimals, priceDecimals);
    }

    public async placeSellOrder(
        market: string,
        tradeAmount: number,
        tradePrice: number | undefined,
        tradeTriggerPrice: number | undefined,
        decimals: number,
        priceDecimals: number
    ): Promise<PlaceOrderResponse> {
        return this.placeOrder(market, false, tradeAmount, tradePrice, tradeTriggerPrice, decimals, priceDecimals);
    }

    public async placeOrder(
        market: string,
        isBuy: boolean,
        tradeAmount: number,
        tradePrice: number | undefined,
        tradeTriggerPrice: number | undefined,
        decimals: number,
        priceDecimals: number
    ): Promise<PlaceOrderResponse> {
        const side = isBuy ? 'buy' : 'sell';
        let response;
        try {
            if (this.ensurePositiveLimit()) {
                const roundScaleFactor = Math.pow(10, decimals);
                tradeAmount = Math.round(tradeAmount * roundScaleFactor) / roundScaleFactor;
                this.logLimit();
                if (tradePrice && tradeTriggerPrice) {
                    // todo
                } else if (tradePrice) {
                    const roundPriceScaleFactor = Math.pow(10, priceDecimals);
                    tradePrice = Math.round(tradePrice * roundPriceScaleFactor) / roundPriceScaleFactor;
                    // round to 0 decimals // change for other COINS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    // tradePrice = Math.round(tradePrice);

                    response = await bitvavo.placeOrder(market, side, 'limit', { amount: tradeAmount, price: tradePrice });
                } else {
                    response = await bitvavo.placeOrder(market, side, 'market', { amount: tradeAmount });
                }
            }
        } catch (error) {
            return Promise.reject();
        }
        this.logLimit();
        //console.log('amountRemaining: ', response.amountRemaining);
        return new PlaceOrderResponse(response);
    }

    public async cancelOrder(market: string, orderId: string): Promise<void> {
        try {
            if (this.ensurePositiveLimit()) {
                await bitvavo.cancelOrder(market, orderId);
            }
        } catch (error) {
            return Promise.reject();
        }
    }

    public async getTrades(market: string, limit = 1000, start?: number, end?: number): Promise<TradeResponse[]> {
        try {
            if (this.ensurePositiveLimit()) {
                const list: TradeResponse[] = [];
                const options = { limit };
                if (start) {
                    options['start'] = start;
                }
                if (end) {
                    options['end'] = end;
                }

                const response = await bitvavo.trades(market, options);
                // tslint:disable-next-line: prefer-const
                for (let item of response) {
                    list.push(new TradeResponse(item));
                }
                return list;
            }
            return [];
        } catch (error) {
            return Promise.reject();
        }
    }

    public async getTickerPrices(market?: string): Promise<TickerPriceResponse[]> {
        try {
            if (this.ensurePositiveLimit()) {
                const list: TickerPriceResponse[] = [];
                const response = await bitvavo.tickerPrice(market ? { market } : {});
                if (market) {
                    list.push(new TickerPriceResponse(response));
                } else {
                    // tslint:disable-next-line: prefer-const
                    for (let item of response) {
                        const index = item.market.indexOf('-');
                        const symbol = item.market.substr(0, index);
                        if (!['EUR', 'AE', 'DASH'].includes(symbol)) {
                            list.push(new TickerPriceResponse(item));
                        }
                    }
                }
                return list;
            }
            return [];
        } catch (error) {
            return Promise.reject();
        }
    }

    public async getTickerPrices24h(): Promise<TickerPrice24hResponse[]> {
        try {
            if (this.ensurePositiveLimit()) {
                const list: TickerPrice24hResponse[] = [];
                const response = await bitvavo.ticker24h({});
                // tslint:disable-next-line: prefer-const
                for (let item of response) {
                    const index = item.market.indexOf('-');
                    const symbol = item.market.substr(0, index);
                    if (!['EUR', 'AE', 'DASH'].includes(symbol)) {
                        list.push(new TickerPrice24hResponse(item));
                    }
                }
                return list;
            }
            return [];
        } catch (error) {
            return Promise.reject();
        }
    }

    public async getOpenOrders(): Promise<OpenOrderResponse[]> {
        try {
            if (this.ensurePositiveLimit()) {
                const list: OpenOrderResponse[] = [];
                const response = await bitvavo.ordersOpen({});
                // tslint:disable-next-line: prefer-const
                for (let item of response) {
                    const index = item.market.indexOf('-');
                    const symbol = item.market.substr(0, index);
                    if (!['EUR', 'AE', 'DASH'].includes(symbol)) {
                        list.push(new OpenOrderResponse(item));
                    }
                }
                return list;
            }
            return [];
        } catch (error) {
            return Promise.reject();
        }
    }

    private ensurePositiveLimit(): boolean {
        const result = bitvavo.getRemainingLimit();
        return result > 100;
    }

    public logLimit(): void {
        console.log(bitvavo.getRemainingLimit());
    }
}
