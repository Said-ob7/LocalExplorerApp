package keiken.localexplorer.Model;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class GeminiResponse {
    private List<Candidate> candidates;

    public List<Candidate> getCandidates() {
        return candidates;
    }

    public void setCandidates(List<Candidate> candidates) {
        this.candidates = candidates;
    }

    public static class Candidate{
        private Content content;

        public Content getContent() {
            return content;
        }

        public void setContent(Content content) {
            this.content = content;
        }
        public static class Content{
            private List<Map<String, String>> parts;

            public List<Map<String, String>> getParts() {
                return parts;
            }

            public void setParts(List<Map<String, String>> parts) {
                this.parts = parts;
            }

        }
    }
}