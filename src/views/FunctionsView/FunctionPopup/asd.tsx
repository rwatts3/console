const Icon = (
  <i>
    <style jsx={true}>{`
      div {
        @p: .bgBlue;
      }
    `}</style>
  </i>
)


const b = (
  <div>
    <style jsx={true}>{`
      div {
        @p: .bgRed;
      }
      div :global(i) {
        @p: .bgBlue50;
      }
    `}</style>
    {Icon}
  </div>
)