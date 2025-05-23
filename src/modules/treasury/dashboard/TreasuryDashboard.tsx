import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useStyles, HeaderTitle } from 'shared/styles/dashboardStyle'
import { PublishedPropertyTable, PreAuctionTable, OnAuctionTable, PostAuctionTable, EndAuctionTable } from 'modules/Tables'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import Grid from '@material-ui/core/Grid'
import TabComponent from 'shared/tab-component'
import { treasuryTabList } from 'shared/helpers/dataConstant'
import axios from 'axios'
import { apiBaseUrl } from 'services/global-constant'
import PropertiesOnboard from 'shared/properties-onboard/PropertiesOnboard'
import PropertyCards from 'shared/components/property-cards'
import {
  getAllPropertiesList,
  getEndAuctionProperties,
  getOnAuctionProperties,
  getPostAuctionProperties,
  getPreAuctionProperties,
  getPublishedProperties,
  updateOnAuction,
  updatePreAuction
} from 'logic/api/propertiesService'

const TreasuryDashboard = (props: any) => {
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState('published')
  const [publishedProperties, setPublishedProperties] = useState<any>([])
  const [publishedLoading, setPublishedLoading] = useState(false)
  // const [tokenToMintData, setTokenToMintData] = useState<any>([])
  // const [transactionLoading, setTransactionLoading] = useState(false)
  const [preAuctionProperties, setPreAuctionProperties] = useState<any>([])
  const [preAuctionLoading, setPreAuctionLoading] = useState(false)
  const [onAuctionProperties, setOnAuctionProperties] = useState<any>([])
  const [onAuctionLoading, setOnAuctionLoading] = useState(false)
  const [postAuctionProperties, setPostAuctionProperties] = useState<any>([])
  const [postAuctionLoading, setPostAuctionLoading] = useState(false)
  const [endAuctionProperties, setEndAuctionProperties] = useState<any>([])
  const [endAuctionLoading, setEndAuctionLoading] = useState(false)
  const { userInfo } = props
  const [allPropertiesList, setAllPropertiesList] = useState<any>([])
  const [newPropertyLoading, setNewPropertyLoading] = useState(false)

  useEffect(() => {
    // const getTokenToMintData = async () => {
    //   try {
    //     setTransactionLoading(true)
    //     const data = {
    //       publicaddress: !!userInfo && userInfo.publicaddress,
    //     }
    //     const res = await axios.post(`${apiBaseUrl}/properties/getAllPendingTransaction`, data)
    //     setTokenToMintData(res.data)
    //   } catch (error) {
    //   } finally {
    //     setTransactionLoading(false)
    //   }
    // }

    // getTokenToMintData() ---

    getEndAuctionProperties(setEndAuctionLoading, setEndAuctionProperties)
    getPublishedProperties(setPublishedLoading, setPublishedProperties)
    getPreAuctionProperties(setPreAuctionLoading, setPreAuctionProperties)
    getOnAuctionProperties(setOnAuctionLoading, setOnAuctionProperties)
    getPostAuctionProperties(setPostAuctionLoading, setPostAuctionProperties)
    getAllPropertiesList(setNewPropertyLoading, setAllPropertiesList)

  }, [userInfo])

  return (
    <Grid>
      <Grid container spacing={2} className={classes.headerStyle}>
        <Grid item xs={12} md={6}>
          <HeaderTitle>Properties</HeaderTitle>
        </Grid>
        <PropertiesOnboard />
      </Grid>

      <Grid container spacing={3} className={classes.tabStyle}>
        <Grid item xs={12} md={8}>
          <TabComponent tabOptions={treasuryTabList} activeTab={activeTab} setActiveTab={setActiveTab} />
        </Grid>
        <Grid item xs={12} md={4}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Grid>
      </Grid>
      <div>
        {/* {activeTab === 'All' && <PropertyCards list={allPropertiesList} dataLoading={newPropertyLoading} />} */}
        {activeTab === 'All' && <PublishedPropertyTable data={allPropertiesList} dataLoading={newPropertyLoading} />}
        {activeTab === 'published' && (
          <PublishedPropertyTable type="treasuryAdmin" data={publishedProperties} dataLoading={publishedLoading} />
        )}
        {activeTab === 'preAuction' && (
          <PreAuctionTable
            data={preAuctionProperties}
            dataLoading={preAuctionLoading}
            type="treasuryAdmin"
            refreshPreAuction={() => updatePreAuction(setPreAuctionProperties)}
            refreshOnAuction={() => updateOnAuction(setOnAuctionProperties)}
          />
        )}
        {activeTab === 'onAuction' && <OnAuctionTable data={onAuctionProperties} dataLoading={onAuctionLoading} />}
        {activeTab === 'postAuction' && <PostAuctionTable data={postAuctionProperties} dataLoading={postAuctionLoading} btn={true} />}
        {/* {activeTab === 'tokenToMint' && <TokenToMintTable data={tokenToMintData} dataLoading={transactionLoading} />} */}
        {activeTab === 'endAuction' && <EndAuctionTable data={endAuctionProperties} dataLoading={endAuctionLoading} />}
      </div>
    </Grid>
  )
}

const mapStateToProps = (state: any) => ({
  userInfo: state.user.userInfo,
})
export default connect(mapStateToProps)(TreasuryDashboard)
