export default `
enum fake__Locale {
  az
  cz
  de
  de_AT
  de_CH
  en
  en_AU
  en_BORK
  en_CA
  en_GB
  en_IE
  en_IND
  en_US
  en_au_ocker
  es
  es_MX
  fa
  fr
  fr_CA
  ge
  id_ID
  it
  ja
  ko
  nb_NO
  nep
  nl
  pl
  pt_BR
  ru
  sk
  sv
  tr
  uk
  vi
  zh_CN
  zh_TW
}

enum fake__Types {
  zipCode
  city
  streetName
  # Configure address with option \`useFullAddress\`
  streetAddress
  secondaryAddress
  county
  country
  countryCode
  state
  stateAbbr
  latitude
  longitude

  colorName
  productCategory
  productName
  # Sum of money. Configure with options \`minMoney\` and \`maxMoney\`
  money
  productMaterial
  product

  companyName
  companyCatchPhrase
  companyBS

  dbColumn
  dbType
  dbCollation
  dbEngine

  pastDate
  futureDate
  recentDate

  financeAccountName
  financeTransactionType
  currencyCode
  currencyName
  currencySymbol
  bitcoinAddress
  internationalBankAccountNumber
  bankIdentifierCode

  hackerAbbr
  hackerPhrase

  # An image url. Configure image with options: \`imageCategory\`,
  # \`imageWidth\`, \`imageHeight\` and \`randomizeImageUrl\`
  imageUrl
  # An URL for an avatar
  avatarUrl
  # Configure email provider with option: \`emailProvider\`
  email
  url
  domainName
  ipv4Address
  ipv6Address
  userAgent
  colorHex
  macAddress
  # Configure password with option \`passwordLength\`
  password

  # Lorem Ipsum text. Configure size with option \`loremSize\`
  lorem

  firstName
  lastName
  fullName
  jobTitle

  uuid
  word
  words
  locale

  filename
  mimeType
  fileExtension
  semver
}

enum fake__imageCategory {
  abstract
  animals
  business
  cats
  city
  food
  nightlife
  fashion
  people
  nature
  sports
  technics
  transport
}

enum fake__loremSize {
  word
  words
  sentence
  sentences
  paragraph
  paragraphs
}

input fake__options {
  # Only for \`type: streetAddress\`
  useFullAddress: Boolean
  # Only for type \`money\`
  minMoney: Float
  # Only for type \`money\`
  maxMoney: Float
  # Only for type \`imageUrl\`
  imageWidth: Int
  # Only for type \`imageUrl\`
  imageHeight: Int
  # Only for type \`imageUrl\`
  imageCategory: fake__imageCategory
  # Only for type \`imageUrl\`
  randomizeImageUrl: Boolean
  # Only for type \`email\`
  emailProvider: String
  # Only for type \`password\`
  passwordLength: Int
  # Only for type \`lorem\`
  loremSize: fake__loremSize
}

directive @fake(type:fake__Types!, options: fake__options = {}, locale:fake__Locale) on FIELD_DEFINITION | SCALAR


scalar examples__JSON
directive @examples(values: [examples__JSON]!) on FIELD_DEFINITION | SCALAR
`
