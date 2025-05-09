import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./ContributionsList.css";
import SearchBar from "../SearchBar/SearchBar";
import Pagination from "../Pagination/Pagination";

interface Contribution {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  owner: string;
  status: "Active" | "Scheduled" | "Complete";
}

const ContributionsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const contributionsPerPage = 14;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("searchQuery") || "";

  const getStatus = (
    startTime: string,
    endTime: string,
  ): "Active" | "Scheduled" | "Complete" => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now >= start && now <= end) return "Active";
    if (now > end) return "Complete";
    return "Scheduled";
  };

  // Fetch contributions data
  useEffect(() => {
    const skip = (currentPage - 1) * contributionsPerPage;

    const url = `http://localhost:8000/contributions/?skip=${skip}&limit=${contributionsPerPage}&title=${searchQuery}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch contributions");
        return response.json();
      })
      .then((data) => {
        if (!data.contributions || data.contributions.length === 0) {
          setContributions([]);
        } else {
          const filteredData = data.contributions.map(
            (contribution: Contribution) => ({
              ...contribution,
              status: getStatus(contribution.startTime, contribution.endTime),
            }),
          );
          setContributions(filteredData);
        }
        setTotalPages(Math.ceil(data.total / contributionsPerPage));
      })
      .catch((err) => {
        setError("Unable to load contributions. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [currentPage, searchQuery]);

  const filteredContributions = contributions.filter((contribution) => {
    const query = searchQuery.toLowerCase();
    const fields = [
      contribution.title,
      contribution.description,
      contribution.owner,
      contribution.status,
    ];

    return fields.some((field) => field.toLowerCase().includes(query));
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ searchQuery: e.target.value, page: "1" });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ searchQuery, page: page.toString() });
  };

  return (
    <div className="contributions-container">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {loading && <p>Loading contributions</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && filteredContributions.length === 0 && (
        <p>No contributions found.</p>
      )}

      <div className="contributions-list">
        {filteredContributions.map((contribution, index) => (
          <div key={index} className="contribution">
            <h3>{contribution.title}</h3>
            <p>{contribution.description}</p>
            <p>Start: {new Date(contribution.startTime).toLocaleString()}</p>
            <p>End: {new Date(contribution.endTime).toLocaleString()}</p>
            <p>Owner: {contribution.owner}</p>
            <p>
              Status:{" "}
              <span className={`status ${contribution.status.toLowerCase()}`}>
                {contribution.status}
              </span>
            </p>
          </div>
        ))}
      </div>

      {!loading && !error && filteredContributions.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ContributionsList;
