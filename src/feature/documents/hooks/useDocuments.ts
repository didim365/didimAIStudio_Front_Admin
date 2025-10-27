import { useState } from "react";
import { Document, DocumentFilter } from "../types";
import { mockDocuments } from "../utils/mockData";

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<DocumentFilter>({});

  // 문서 목록 조회
  const fetchDocuments = async (newFilter?: DocumentFilter) => {
    setIsLoading(true);
    try {
      // TODO: 실제 API 호출로 교체
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filtered = [...mockDocuments];

      if (newFilter?.search) {
        filtered = filtered.filter((doc) =>
          doc.title.toLowerCase().includes(newFilter.search!.toLowerCase())
        );
      }

      if (newFilter?.groupId) {
        filtered = filtered.filter((doc) => doc.groupId === newFilter.groupId);
      }

      if (newFilter?.embeddingStatus) {
        filtered = filtered.filter(
          (doc) => doc.embeddingStatus === newFilter.embeddingStatus
        );
      }

      setDocuments(filtered);
      setFilter(newFilter || {});
    } finally {
      setIsLoading(false);
    }
  };

  // 문서 권한 업데이트
  const updateDocumentPermissions = async (
    documentId: string,
    permissions: Document["permissions"]
  ) => {
    setIsLoading(true);
    try {
      // TODO: 실제 API 호출로 교체
      await new Promise((resolve) => setTimeout(resolve, 500));

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId
            ? { ...doc, permissions, updatedAt: new Date() }
            : doc
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 문서 삭제
  const deleteDocument = async (documentId: string) => {
    setIsLoading(true);
    try {
      // TODO: 실제 API 호출로 교체
      await new Promise((resolve) => setTimeout(resolve, 500));

      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    documents,
    isLoading,
    filter,
    fetchDocuments,
    updateDocumentPermissions,
    deleteDocument,
  };
}
