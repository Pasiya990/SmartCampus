import AdminLayout from "../components/AdminLayout";
import ResourceCatalogueContent from "../components/ResourceCatalogueContent";

export default function AdminResourcesPage() {
  return (
    <AdminLayout activeMenu="resources">
      <ResourceCatalogueContent role="ADMIN" />
    </AdminLayout>
  );
}