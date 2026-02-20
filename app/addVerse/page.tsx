import AddVerseForm from "../components/AddVerseForm";

export default async function addVersePage() {

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Add a Verse</h1>
            <AddVerseForm />
        </div>
    );
}