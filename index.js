import Portfolio from './src/portfolio';
import Asset from './src/asset';
import Percent from './src/percent';
import USD from './src/usd'; const $ = USD;

const assets = [{
  asset: Asset('ITOT', $(91.49)),
  quantity: 0,
  ideal: Percent(30)
}, {
  asset: Asset('IJS', $(110.21)),
  quantity: 0,
  ideal: Percent(10)
}, {
  asset: Asset('IXUS', $(51.35)),
  quantity: 0,
  ideal: Percent(20)
}, {
  asset: Asset('AGG', $(109.62)),
  quantity: 0,
  ideal: Percent(20)
}, {
  asset: Asset('TLT', $(123.42)),
  quantity: 0,
  ideal: Percent(15)
}, {
  asset: Asset('IAU', $(11.28)),
  quantity: 0,
  ideal: Percent(5)
}];

let portfolio = Portfolio(assets);
portfolio.load($(3000));
console.log(portfolio.assets);
