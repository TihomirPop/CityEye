import { BaseSyntheticEvent, useState } from 'react';
import 'firebase/firestore';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../config/Firebase';
import { WebUser } from '../users/User';
import { ref, uploadBytes } from 'firebase/storage';

interface Props{
  currentUser: WebUser;
}

const AddEvent = ({currentUser}: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [epochStart, setEpochStart] = useState('');
  const [epochEnd, setEpochEnd] = useState('');
  const [location, setLocation] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState<File | null>(null);

  const handleAddEvent = async (e: BaseSyntheticEvent) => {
    e.preventDefault();

    if(image){
      const docRef = await addDoc(collection(db, "events"), {
        title: title,
        description: description,
        epochStart: (new Date(epochStart)).getTime() / 1000,
        epochEnd: (new Date(epochEnd)).getTime() / 1000,
        imageUrl: null,
        city: currentUser.city,
        location: location,
        locationAddress: locationAddress,
        price: price
      });
  
      const imageUrl = `eventImages/${image.name}-${docRef.id}`;
      uploadBytes(ref(storage, imageUrl), image)
        .then(() => console.log('image uploaded'))
        .catch(() => console.error('image upload error'));
      
      updateDoc(docRef, {imageUrl: imageUrl});
      
      setTitle('');
      setDescription('');
      setEpochStart('');
      setEpochEnd('')
      setImage(null);
      setLocation('');
      setLocationAddress('');
      setPrice(0);
    }
  };

  return (
    <form onSubmit={handleAddEvent}>
      <div>
        <label htmlFor="title">Title</label>
        <br />
        <input
          type="text"
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label htmlFor="description">Description</label>
        <br />
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label htmlFor="epochStart">Start Time</label>
        <br />
        <input
          type="datetime-local"
          id="epochStart"
          value={epochStart}
          onChange={(event) => setEpochStart(event.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label htmlFor="epochEnd">End Time</label>
        <br />
        <input
          type="datetime-local"
          id="epochEnd"
          value={epochEnd}
          onChange={(event) => setEpochEnd(event.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label htmlFor="image">Image URL</label>
        <br />
        <input
          type="file"
          accept="image/*"
          id="image"
          onChange={(event) => setImage(event.target.files ? event.target.files[0] : null)}
          required
        />
      </div>
      <br />
      <div>
        <label htmlFor="location">Location</label>
        <br />
        <input
          type="text"
          id="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label htmlFor="locationAddress">Address</label>
        <br />
        <input
          type="text"
          id="locationAddress"
          value={locationAddress}
          onChange={(event) => setLocationAddress(event.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label htmlFor="price">Price</label>
        <br />
        <input
          type="number"
          id="price"
          value={price}
          onChange={(event) => setPrice(Number(event.target.value))}
          required
        />
      </div>
      <br />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default AddEvent;
