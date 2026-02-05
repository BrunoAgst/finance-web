const Button = (props) => {
  return (
    <button
      {...props}
      className="bg-slate-600 p-2 rounded-md text-white hover:bg-slate-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm"
    >
      {props.children}
    </button>
  );
};

export default Button;
