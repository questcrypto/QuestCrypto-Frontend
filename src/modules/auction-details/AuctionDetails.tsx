import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { errorAlert } from 'logic/actions/alerts.actions'
import { useStyles, HeaderContainer, HeaderPath, HeaderTitle } from './style'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import PropertyImages from './components/PropertyImages'
import AuctionBid from './components/AuctionBid'
import AuctionStats from './components/AuctionStats'
import ComponentLoader from 'shared/loader-components/component-loader'
import axios from 'axios'
import { apiBaseUrl } from 'services/global-constant'
import history from 'modules/app/components/history'
import { getDaysValue } from 'shared/helpers/globalFunction'
import { getApprovedTokens } from 'modules/block-chain/BlockChainMethods'

const AuctionDetails = (props: any) => {
  const classes = useStyles()
  const [dataLoading, setDataLoading] = useState(false)
  const [auctionData, setAuctionData] = useState<any>({})
  const [selectedImg, setSelectedImg] = useState<any>({})
  const [imageList, setImageList] = useState<any>([])
  const [totalToken, setTotalToken] = useState(0)
  const [reservePriceMet, setReservePriceMet] = useState(false)
  const [currentBid, setCurrentBid] = useState(0)
  const [propertyId, setPropertyId] = useState('')
  const [approvedTokens, setApprovedTokens] = useState(0)
  const { userInfo, match, errorAlert } = props

  const getApprovedTokenValue = async () => {
    try {
      setDataLoading(true)
      const tokens = await getApprovedTokens()
      setApprovedTokens(tokens)
    } catch (err) {
      setApprovedTokens(0)
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    const auctionId = match.params.auctionId
    const getAuctionData = async () => {
      try {
        setDataLoading(true)
        const res = await axios.get(`${apiBaseUrl}/auction/getDetailsOfParticipatedAccountBy`, {
          params: { id: auctionId, publicaddress: userInfo?.publicaddress },
        })
        if (!!res && res.data) {
          const imgList = []
          for (const item of res.data.propertyDetail.getDocs) {
            if (item.type === 0) {
              imgList.push(item)
            }
          }
          setPropertyId(res.data.propertyDetail.propertyDetails.id)
          const totalTokenVal = parseInt(res.data.propertyDetail.propertyDetails.CurrentValue)
          const reserveVal = res.data.auctionDetails[0].minReserve + res.data.auctionDetails[0].slReserve
          if (res.data.bidStats.amountRaised > reserveVal) {
            setReservePriceMet(true)
          }
          const currentBidVal = res.data.auctionDetails[0].suggestedLowestBid
          setCurrentBid(currentBidVal)
          setTotalToken(totalTokenVal)
          setSelectedImg(imgList[0])
          setImageList(imgList)

          const { auctionDetails } = res.data

          const daysRemaining = getDaysValue(new Date(), auctionDetails[0].endDate)

          if (daysRemaining < 0) {
            history.goBack()
          }

          setAuctionData(res.data)
        }
      } catch (error) {
      } finally {
        setDataLoading(false)
      }
    }

    getApprovedTokenValue()
    getAuctionData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match])

  return (
    <Box className={classes.root}>
      <HeaderContainer>
        <HeaderPath>
          {!dataLoading && (
            <>
              <span>Properties / New / {propertyId}</span> / Auction
            </>
          )}
        </HeaderPath>
        <HeaderTitle>Property </HeaderTitle>
      </HeaderContainer>
      {dataLoading ? (
        <ComponentLoader />
      ) : (
        <div>
          {!!auctionData && Object.values(auctionData).length > 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} container>
                <PropertyImages
                  imageList={imageList}
                  selectedImg={selectedImg}
                  setSelectedImg={setSelectedImg}
                  propertyText={auctionData?.propertyDetail?.propertyDetails?.Comments!}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={5} container>
                <AuctionBid
                  currentBid={currentBid}
                  totalToken={totalToken}
                  auctionID={match.params.auctionId}
                  biddersID={!!userInfo && userInfo.publicaddress}
                  approvedTokens={approvedTokens}
                  refreshApprovedTokensValue={setApprovedTokens}
                  propertyID={auctionData.auctionDetails[0].propidId}
                  propertyName={auctionData.propertyDetail.propertyDetails.PropertyName}
                  myBidDetails={auctionData?.myBidDetails!}
                  email={userInfo?.email}
                  suggestedLowestBid={auctionData.auctionDetails[0].suggestedLowestBid}
                  errorAlert={errorAlert}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} container>
                <AuctionStats
                  bidStats={auctionData.bidStats}
                  auctionDetails={auctionData.auctionDetails[0]}
                  reservePriceMet={reservePriceMet}
                  totalToken={totalToken}
                />
              </Grid>
            </Grid>
          )}
        </div>
      )}
    </Box>
  )
}

const mapStateToProps = (state: any) => ({
  userInfo: state.user.userInfo,
})
export default withRouter(connect(mapStateToProps, { errorAlert })(AuctionDetails))
