const Pizza = (props) => {
  return (
    <div className="pizza">
      <h1>{props.name}</h1>
      <p>{props.description}</p>
      <img src={props.image_url} alt={props.name}></img>
    </div>
  );
};

export default Pizza;
