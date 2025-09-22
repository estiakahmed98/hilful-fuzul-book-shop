import CategoryPage from "./category";

interface Params {
  id: string;
}

const Page = async ({ params }: { params: Params }) => {
  const param = await params;

  return (
    <div>
      <CategoryPage params={param} />
    </div>
  );
};

export default Page;
