import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useStyles, HeaderTitle } from 'shared/styles/dashboardStyle'
import {
  NewPropertyTable,
  ApprovePropertyTable,
  PublishedPropertyTable,
  PreAuctionTable,
  OnAuctionTable,
  PostAuctionTable,
} from 'modules/Tables'
import { PrimaryButton } from 'shared/components/buttons'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import Grid from '@material-ui/core/Grid'
import TabComponent from 'shared/tab-component'
import { propertyTabList } from 'shared/helpers/dataConstant'
import { Paths } from 'modules/app/components/routes/types'
import history from 'modules/app/components/history'
import axios from 'axios'
import { apiBaseUrl } from 'services/global-constant'
import PropertiesOnboard from 'shared/properties-onboard/PropertiesOnboard'
import PropertyCards from 'shared/components/property-cards'
import {
  getAllPropertiesList,
  getNewPropertiesList,
  getApproveProperties,
  getPublishedProperties,
  getPreAuctionProperties,
  getOnAuctionProperties,
  getPostAuctionProperties,
  updateApprovedProperty,
  updatePublishedProperty
} from 'logic/api/propertiesService'

const AdminDashboard = (props: any) => {
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState('published')
  const [newPropertiesList, setNewPropertiesList] = useState<any>([])
  const [newPropertyLoading, setNewPropertyLoading] = useState(false)
  const [approvedProperties, setApprovedProperties] = useState<any>([])
  const [approvedLoading, setApprovedLoading] = useState(false)
  const [publishedProperties, setPublishedProperties] = useState<any>([])
  const [publishedLoading, setPublishedLoading] = useState(false)
  const [preAuctionProperties, setPreAuctionProperties] = useState<any>([])
  const [preAuctionLoading, setPreAuctionLoading] = useState(false)
  const [onAuctionProperties, setOnAuctionProperties] = useState<any>([])
  const [onAuctionLoading, setOnAuctionLoading] = useState(false)
  const [postAuctionProperties, setPostAuctionProperties] = useState<any>([])
  const [postAuctionLoading, setPostAuctionLoading] = useState(false)
  const [allPropertiesList, setAllPropertiesList] = useState<any>([])


  useEffect(() => {
    getNewPropertiesList(setNewPropertyLoading, setNewPropertiesList)
    getApproveProperties(setApprovedLoading, setApprovedProperties)
    getPublishedProperties(setPublishedLoading, setPublishedProperties)
    getPreAuctionProperties(setPreAuctionLoading, setPreAuctionProperties)
    getOnAuctionProperties(setOnAuctionLoading, setOnAuctionProperties)
    getPostAuctionProperties(setPostAuctionLoading, setPostAuctionProperties)
    getAllPropertiesList(setNewPropertyLoading, setAllPropertiesList)
  }, [])

  const handleAddProperty = () => {
    history.push({
      pathname: Paths.addPropertyForm,
      state: { detail: 'some_value' }
  });
  }

  const updateApprove = () => {
    updateApprovedProperty(setApprovedProperties)
    updatePublishedProperty(setPublishedProperties)
  }

  return (
    <Grid>
      <Grid container spacing={2} className={classes.headerStyle}>
        <Grid item xs={12} md={6}>
          <HeaderTitle>Properties</HeaderTitle>
        </Grid>
        <PropertiesOnboard />
      </Grid>

      <Grid container spacing={3} className={classes.tabStyle}>
        <Grid item xs={12} md={7}>
          <TabComponent tabOptions={propertyTabList} activeTab={activeTab} setActiveTab={setActiveTab} />
        </Grid>
        <Grid item xs={6} md={3}>
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
        <Grid item xs={6} md={2}>
          <PrimaryButton onClick={() => handleAddProperty()}>Add New Property</PrimaryButton>
        </Grid>
      </Grid>
      <div>
        {/* {activeTab === 'All' && <PropertyCards list={allPropertiesList} dataLoading={newPropertyLoading} />} */}
        {activeTab === 'All' && <NewPropertyTable data={allPropertiesList} dataLoading={newPropertyLoading} />}
        {activeTab === 'new' && <NewPropertyTable data={newPropertiesList} dataLoading={newPropertyLoading} />}
        {activeTab === 'approved' && (
          <ApprovePropertyTable
            type="admin"
            data={approvedProperties}
            dataLoading={approvedLoading}
            setActiveTab={setActiveTab}
            updateApprove={updateApprove}
          />
        )}
        {activeTab === 'published' && <PublishedPropertyTable data={publishedProperties} dataLoading={publishedLoading} />}
        {activeTab === 'preAuction' && <PreAuctionTable data={preAuctionProperties} dataLoading={preAuctionLoading} />}
        {activeTab === 'onAuction' && <OnAuctionTable data={onAuctionProperties} dataLoading={onAuctionLoading} />}
        {activeTab === 'postAuction' && <PostAuctionTable data={postAuctionProperties} dataLoading={postAuctionLoading} btn={false} />}
      </div>
    </Grid>
  )
}

const mapStateToProps = (state: any) => ({
  userInfo: state.user.userInfo,
})
export default connect(mapStateToProps)(AdminDashboard)
