import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const UserPlaces = () => {
  const [loadedPlaces, setloadedPlaces] = useState(null)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  const userId = useParams().userId;
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`)
        setloadedPlaces(responseData.places)
      } catch (error) { }
    }
    fetchPlaces()
  }, [sendRequest, userId])
  const placeDeletedHandler = (deletedPlaceId) => {
    setloadedPlaces(prevplace => prevplace.filter(place => place.id !== deletedPlaceId))
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <div className='center'>
        <LoadingSpinner asOverlay />
      </div>}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
    </React.Fragment>
  )
};

export default UserPlaces;
