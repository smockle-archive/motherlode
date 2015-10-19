import Portfolio from './src/portfolio';
import Asset from './src/asset';
import Percent from './src/percent';
import USD from './src/usd'; const $ = USD;

const assets = [{
  asset: Asset('VTI', $(105)),
  quantity: 0,
  ideal: Percent(30)
}, {
  asset: Asset('VBR', $(102.47)),
  quantity: 0,
  ideal: Percent(10)
}, {
  asset: Asset('VEU', $(45.79)),
  quantity: 0,
  ideal: Percent(15)
}, {
  asset: Asset('VSS', $(95.98)),
  quantity: 0,
  ideal: Percent(5)
}, {
  asset: Asset('BND', $(82.05)),
  quantity: 0,
  ideal: Percent(20)
}, {
  asset: Asset('TLT', $(123.71)),
  quantity: 0,
  ideal: Percent(15)
}, {
  asset: Asset('IAU', $(11.35)),
  quantity: 0,
  ideal: Percent(5)
}];

let portfolio = Portfolio(assets);
portfolio.load($(30000));
console.log(portfolio.assets);
