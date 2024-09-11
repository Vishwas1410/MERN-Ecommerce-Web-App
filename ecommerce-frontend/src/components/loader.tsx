const Loader = () => {
  return <div>Loading...</div>;
};

export default Loader;

interface skeletonProps {
  width?: string;
  length?: number;
}

export const Skeleton = ({ width = "unset", length= 3 }: skeletonProps) => {
  const skeletons = Array.from({length} , (_,idx) => <div className="skeleton-shape" key={idx} style={{ width }}></div>)
  return (
    <div className="skeleton-loader" style={{ width }}>
      {skeletons}
    </div>
  );
};
