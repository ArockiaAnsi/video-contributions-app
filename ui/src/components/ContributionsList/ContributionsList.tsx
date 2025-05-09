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
  const [allContributions, setAllContributions] = useState<Contribution[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const contributionsPerPage = 14;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("searchQuery") || "";
  const owner = searchParams.get("owner") || "";
  const status = searchParams.get("status") || "";

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
    setLoading(true);
    setError(null);

    const url = `http://localhost:8000/contributions/`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch contributions");
        return response.json();
      })
      .then((data) => {
        const withStatus = data.contributions.map(
          (contribution: Contribution) => ({
            ...contribution,
            status: getStatus(contribution.startTime, contribution.endTime),
          }),
        );
        setAllContributions(withStatus);
      })
      .catch(() => {
        setError("Service is temporarily unavailable. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = allContributions.filter((contribution) => {
      return (
        contribution.title.toLowerCase().includes(query) ||
        contribution.owner.toLowerCase().includes(query) ||
        contribution.status.toLowerCase().includes(query)
      );
    });

    const start = (currentPage - 1) * contributionsPerPage;
    const end = start + contributionsPerPage;
    const paginated = filtered.slice(start, end);

    setContributions(paginated);
    setTotalPages(Math.ceil(filtered.length / contributionsPerPage));
  }, [allContributions, searchQuery, currentPage]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ searchQuery: event.target.value, page: "1" });
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
      {!loading && !error && contributions.length === 0 && (
        <p>No contributions found.</p>
      )}

      <div className="contributions-list">
        {contributions.map((contribution, index) => (
          <div key={index} className="contribution">
            <h3>{contribution.title}</h3>
            <p>{contribution.description}</p>
            <p>
              <span className="label">Start:</span>{" "}
              {new Date(contribution.startTime).toLocaleString()}
            </p>
            <p>
              <span className="label">End:</span>{" "}
              {new Date(contribution.endTime).toLocaleString()}
            </p>
            <p>
              <span className="label">Owner:</span> {contribution.owner}
            </p>
            <p>
              <span className="label">Status: </span>
              <span className={`status ${contribution.status.toLowerCase()}`}>
                {contribution.status}
              </span>
            </p>
          </div>
        ))}
      </div>

      {!loading && !error && contributions.length > 0 && (
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
