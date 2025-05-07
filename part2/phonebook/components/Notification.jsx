const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='infoMessage'>
      {message}
    </div>
  )
}

export default Notification
