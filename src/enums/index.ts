export enum dispatchTypes {
  changeLanguage = 'CHANGE_LANGUAGE',
  changeCountry = 'CHANGE_COUNTRY',
  changeCalculator = 'CHANGE_CALCULATOR',
  changeResults = 'CHANGE_RESULTS'
}

export enum currency {
  dolar = 5.33,
  gold = 62.59
}

export enum knowRegionTypes {
  YES = '1',
  NO = '2'
}

export enum typeMiningTypes {
  ALLUVION = 0,
  FERRY = 1,
  PIT = 2
}

export enum retortTypes {
  yes = 0,
  NO = 1
}

export enum analysisUnitTypes {
  IMPACTED_AREA = 1,
  AMOUNT_GOLD = 2,
  YEARS_OF_MINING = 3,
  QTD_FERRY = 5
}

export enum valueHypothesisTypes {
  CONSERVATIVE = 0.29,
  PREUCATIONARY_PRINCIPLE = 0.343
}

export enum usesValuesTypes {
  environmental = '1',
  planning = '2',
  technology = '3'
}

export enum ROUTE {
  home = '/',
  calculator = '/calculator',
  about = '/about',
  contact = '/contact',
  stepByStep = '/step-by-step',
  team = '/team',
  CSFAndCreators = '/team/csf-and-creators',
  investors = '/team/investors',
  partnership = '/team/partnership',
  awards = '/blog/awards',
  miningMap = '/blog/mining-map',
  partnershipWithMPF = '/blog/partnership-mpf',
  publicMinistryOfPeru = '/blog/public-ministry-of-peru',
  pressAdvisory = '/blog/press-advisory',
  usageStories = '/blog/usage-stories',
  cases = '/publications/cases',
  scientificArticle = '/publications/scientific-article',
  impact = '/impact/',
  conservationXLabs = '/blog/conservation-x-labs',
  DownloadPDF = '/report/pdf',
  PDFViewer = '/report/view'
}
