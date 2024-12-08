import FilesBrowser from "@/components/FilesBrowser";

const Trash = () => {
  return (
    <div>
      <FilesBrowser title="Trashed files" trashed />
    </div>
  );
};

export default Trash;
